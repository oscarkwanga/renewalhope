// jobs/monthlyStatements.js
const cron = require('node-cron');
const PDFDocument = require('pdfkit');
const streamBuffers = require('stream-buffers');

const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Statement = require('../models/Statement');

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html, attachments }) {
  const from = process.env.RESEND_FROM || 'Dwelify <no-reply@dwelify.xyz>';
  return resend.emails.send({ from, to, subject, html, attachments });
}

function buildHtmlStatement({ user, transactions, periodStart, periodEnd, total }) {
  const rows = transactions.map(t => {
    const date = t.transactionDate ? new Date(t.transactionDate) : new Date(t.createdAt);
    const dateStr = date.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' });
    const mpesaRef = t.mpesaReceiptNumber || t.MpesaReceiptNumber || t.mpesaRef || t.checkoutRequestID || '-';
    const desc = t.description || t.type || (t.property && t.property.title) || '';
    return `
      <tr>
        <td style="padding:6px;border:1px solid #e6e6e6;">${dateStr}</td>
        <td style="padding:6px;border:1px solid #e6e6e6;">${mpesaRef}</td>
        <td style="padding:6px;border:1px solid #e6e6e6;">${desc}</td>
        <td style="padding:6px;border:1px solid #e6e6e6;text-align:right;">KES ${Number(t.amount || 0).toLocaleString()}</td>
      </tr>
    `;
  }).join('\n');

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color:#222;">
      <div style="max-width:700px;margin:0 auto;padding:20px;">
        <h2 style="margin-bottom:6px;">Monthly Statement</h2>
        <p style="margin-top:0;color:#666;">Period: ${periodStart.toDateString()} — ${periodEnd.toDateString()}</p>
        <p>Hello ${user.firstname || user.email},</p>
        <p>Below is a summary of all transactions you made through Dwelify during the period above.</p>

        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #e6e6e6;text-align:left;background:#fafafa">Date</th>
              <th style="padding:8px;border:1px solid #e6e6e6;text-align:left;background:#fafafa">M-Pesa Ref</th>
              <th style="padding:8px;border:1px solid #e6e6e6;text-align:left;background:#fafafa">Description</th>
              <th style="padding:8px;border:1px solid #e6e6e6;text-align:right;background:#fafafa">Amount (KES)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr>
              <td colspan="3" style="padding:8px;border:1px solid #e6e6e6;text-align:right;font-weight:bold;">Total</td>
              <td style="padding:8px;border:1px solid #e6e6e6;text-align:right;font-weight:bold;">KES ${Number(total).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <p style="color:#666;margin-top:14px;">If you have questions about any transactions, reply to this email or contact support.</p>
        <p style="margin-top:18px;">Regards,<br/><strong>The Dwelify Team</strong></p>
      </div>
    </div>
  `;
}

async function buildPdfBuffer(transactions, user, periodStart, periodEnd, total) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const writable = new streamBuffers.WritableStreamBuffer();
  doc.pipe(writable);

  doc.fontSize(16).text(`Monthly Statement`, { align: 'left' });
  doc.moveDown(0.2);
  doc.fontSize(10).text(`${user.firstname || user.email}`);
  doc.text(`Period: ${periodStart.toDateString()} — ${periodEnd.toDateString()}`);
  doc.moveDown();

  doc.fontSize(11);
  transactions.forEach((t, i) => {
    const date = t.transactionDate ? new Date(t.transactionDate) : new Date(t.createdAt);
    const dateStr = date.toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' });
    const mpesaRef = t.mpesaReceiptNumber || t.MpesaReceiptNumber || t.mpesaRef || t.checkoutRequestID || '-';
    const desc = t.description || t.type || (t.property && t.property.title) || '';
    doc.text(`${i+1}. ${dateStr} | ${mpesaRef} | ${desc} | KES ${Number(t.amount || 0).toLocaleString()}`);
  });

  doc.moveDown();
  doc.fontSize(12).text(`Total: KES ${Number(total).toLocaleString()}`, { bold: true });
  doc.end();

  return writable.getBuffer();
}

/**
 * Run statement generation for the period [periodStart, periodEnd]
 * options: { attachPdf: boolean, batchSize: number }
 */
async function runStatementsForPeriod(periodStart, periodEnd, options = {}) {
  const attachPdf = options.attachPdf !== undefined ? options.attachPdf : true;
  const batchSize = options.batchSize || 50;

  // Find successful transactions inside the period (try transactionDate first then createdAt)
  const txns = await Transaction.find({
    status: 'SUCCESS',
    $or: [
      { transactionDate: { $gte: periodStart, $lte: periodEnd } },
      { createdAt: { $gte: periodStart, $lte: periodEnd } }
    ]
  }).populate('property').lean();

  if (!txns || txns.length === 0) {
    console.log('No successful transactions in the given period.');
    return { message: 'no-transactions' };
  }

  // Group transactions by user identifier (try user->payer->tenant->phone)
  const groups = {};
  for (const t of txns) {
    const key =
      (t.user && String(t.user)) ||
      (t.payer && String(t.payer)) ||
      (t.tenant && String(t.tenant)) ||
      (t.callbackPhoneNumber) ||
      (t.contact) ||
      (t.payerPhone) ||
      ('unknown:' + (t._id)); // fallback unique key

    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }

  // Iterate groups in batches to avoid rate-limit spikes
  const keys = Object.keys(groups);
  for (let i = 0; i < keys.length; i += batchSize) {
    const batchKeys = keys.slice(i, i + batchSize);

    await Promise.all(batchKeys.map(async (key) => {
      const transactions = groups[key];
      // find User by id or phone
      let user = null;
      let userEmail = null;

      // If key looks like an ObjectId (24 hex) use as id
      if (/^[0-9a-fA-F]{24}$/.test(key)) {
        user = await User.findById(key).lean();
      } else {
        // treat it as phone number
        user = await User.findOne({ contact: key }).lean();
      }

      if (!user) {
        // No registered user for these transactions; skip or optionally send to phone owner via SMS (not implemented)
        console.log(`Skipping statements for key=${key} — no user found`);
        // create a skipped Statement record summarizing
        await Statement.create({
          user: null,
          userEmail: null,
          periodStart,
          periodEnd,
          status: 'skipped',
          totalAmount: transactions.reduce((s, x) => s + Number(x.amount || 0), 0),
          detailCount: transactions.length,
          meta: { reason: 'no-user-found', key }
        });
        return;
      }

      userEmail = user.email;
      if (!userEmail) {
        console.log(`Skipping ${user._id} — no email on user`);
        await Statement.create({
          user: user._id,
          userEmail: null,
          periodStart, periodEnd,
          status: 'skipped',
          totalAmount: transactions.reduce((s, x) => s + Number(x.amount || 0), 0),
          detailCount: transactions.length,
          meta: { reason: 'no-email' }
        });
        return;
      }

      // Idempotency: skip if Statement already exists for this user & period
      const exists = await Statement.findOne({ user: user._id, periodStart, periodEnd }).lean();
      if (exists) {
        console.log(`Statement already sent for user ${userEmail} for this period; skipping`);
        return;
      }

      // Prepare email HTML + pdf
      const total = transactions.reduce((s, x) => s + Number(x.amount || 0), 0);
      const html = buildHtmlStatement({ user, transactions, periodStart, periodEnd, total });

      let attachments;
      if (attachPdf) {
        try {
          const pdfBuf = await buildPdfBuffer(transactions, user, periodStart, periodEnd, total);
          attachments = [{
            name: 'statement.pdf',
            data: pdfBuf.toString('base64'),
            type: 'application/pdf'
          }];
        } catch (pdfErr) {
          console.warn('PDF generation failed for user', userEmail, pdfErr);
          attachments = null;
        }
      }

      try {
        await sendEmail({
          to: userEmail,
          subject: `Your Dwelify statement — ${periodStart.toDateString()} to ${periodEnd.toDateString()}`,
          html,
          attachments
        });
        await Statement.create({
          user: user._id,
          userEmail,
          periodStart,
          periodEnd,
          sentAt: new Date(),
          status: 'sent',
          totalAmount: total,
          detailCount: transactions.length
        });
        console.log(`Statement sent to ${userEmail}, total KES ${total}`);
      } catch (err) {
        console.error('Failed to send statement to', userEmail, err);
        await Statement.create({
          user: user._id,
          userEmail,
          periodStart,
          periodEnd,
          status: 'failed',
          meta: { error: err.message }
        });
      }
    })); // Promise.all for batch
    // small delay between batches if you want to be gentle on rate limits:
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return { message: 'done', groups: keys.length };
}

/**
 * Cron schedule helper — run at 06:00 on day 28 of each month in Africa/Nairobi
 */
function scheduleMonthlyStatements() {
  cron.schedule('0 6 28 * *', async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // current month
      const periodEnd = new Date(year, month, 28, 23, 59, 59, 999);
      const prev = new Date(year, month - 1, 28, 0, 0, 0, 0);
      const periodStart = new Date(prev.getFullYear(), prev.getMonth(), 28, 0, 0, 0, 0);
      console.log('Running scheduled monthly statements for', periodStart, '->', periodEnd);
      await runStatementsForPeriod(periodStart, periodEnd, { attachPdf: true });
    } catch (err) {
      console.error('Scheduled monthly statements error:', err);
    }
  }, { timezone: 'Africa/Nairobi' });

  console.log('Monthly statements scheduled (28th of each month at 06:00 Africa/Nairobi)');
}

module.exports = {
  runStatementsForPeriod,
  scheduleMonthlyStatements
};
