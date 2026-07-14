const Transaction = require('./models/Transaction');
const House = require('./models/House');
const { getSocket } = require('./socket');

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }) {
  try {
    const from = process.env.RESEND_FROM || 'Dwelify <no-reply@dwelify.xyz>';
    await resend.emails.send({ from, to, subject, html });
    console.log(`[mpesaCallback] Email sent to ${to} — ${subject}`);
  } catch (err) {
    console.error('[mpesaCallback] Failed to send email:', err?.response?.data || err?.message || err);
  }
}

const handleMpesaCallback = async (req, res) => {
  console.log('[mpesaCallback] Raw payload:', JSON.stringify(req.body));

  // Drill down to stkCallback
  const body = req.body.Body?.stkCallback || req.body.Body || req.body;
  const { CheckoutRequestID, ResultCode, ResultDesc } = body;
  console.log('[mpesaCallback] Parsed:', { CheckoutRequestID, ResultCode, ResultDesc });

  // Safely pull out metadata array
  const items = Array.isArray(body.CallbackMetadata?.Item)
    ? body.CallbackMetadata.Item
    : [];

  // Build an object { Amount:…, MpesaReceiptNumber:…, … }
  const meta = items.reduce((acc, { Name, Value }) => {
    acc[Name] = Value;
    return acc;
  }, {});

  console.log('[mpesaCallback] Parsed metadata:', meta);

  try {
    // Read the existing transaction (if any) to know previous status
    const existingTxn = await Transaction.findOne({ checkoutRequestID: CheckoutRequestID }).lean();

    const newStatus = ResultCode === 0 ? 'SUCCESS' : 'FAILED';

    // Merge the status update and all metadata fields
    const updatedTxn = await Transaction.findOneAndUpdate(
      { checkoutRequestID: CheckoutRequestID },
      {
        status:     newStatus,
        resultDesc: ResultDesc,
        mpesaReceiptNumber: meta.MpesaReceiptNumber,
        transactionDate:    meta.TransactionDate,
        callbackPhoneNumber: meta.PhoneNumber,
        callbackData:       body,
      },
      { new: true }
    );

    if (!updatedTxn) {
      console.error('[mpesaCallback] No transaction found with ID', CheckoutRequestID);
    } else {
      console.log('[mpesaCallback] DB updated:', updatedTxn);

      // Emit the full updated document
      getSocket().emit('transactionUpdated', updatedTxn);
      console.log('[mpesaCallback] Emitted transactionUpdated');

      // Only send confirmation/reservation emails when transaction just became SUCCESS
      const wasPreviouslySuccess = existingTxn && String(existingTxn.status).toUpperCase() === 'SUCCESS';
      if (newStatus === 'SUCCESS' && !wasPreviouslySuccess) {
        try {
          // Load property to get tenant & landlord details
          const prop = updatedTxn.property
            ? await House.findById(updatedTxn.property).populate('tenant').populate('landlord')
            : null;

          const tenantEmail = prop?.tenant?.email || updatedTxn.tenantEmail || null;
          const landlordEmail = prop?.landlord?.email || null;
          const tenantFirst = prop?.tenant?.firstname || updatedTxn.tenantName || 'Tenant';
          const landlordFirst = prop?.landlord?.firstname || 'Landlord';
          const propertyTitle = prop?.title || prop?.name || updatedTxn.propertyTitle || 'your selected property';
          const amount = updatedTxn.amount || meta.Amount || 'an amount';

          // Tenant confirmation email
          if (tenantEmail) {
            const tenantHtml = `
              <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f7f9fc; padding: 28px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 26px; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);">
                  <h2 style="margin-top:0;">Hello ${tenantFirst},</h2>
                  <h3 style="color:#FF6F61; margin-bottom:8px;">Payment confirmed</h3>
                  <p style="line-height:1.6;">Your payment of <strong>KES ${amount}</strong> for <strong>${propertyTitle}</strong> has been received by M-Pesa and is now confirmed.</p>
                  <p style="line-height:1.6;">We will hold the funds in escrow until you attend the property tour and confirm everything is as expected. After confirmation, we will release the funds to the landlord.</p>
                  <p style="margin-top:18px;">Warm regards,<br/><strong>The Dwelify Team</strong></p>
                  <hr style="margin:20px 0; border-top:1px solid #eee;" />
                  <p style="font-size:12px; color:#777;">If you have questions, reply to this email and our support team will help.</p>
                </div>
              </div>`;
            await sendEmail({ to: tenantEmail, subject: 'Payment confirmed — Dwelify', html: tenantHtml });
          }

          // Landlord notification email
          if (landlordEmail) {
            const landlordHtml = `
              <div style="font-family: Arial, Helvetica, sans-serif; background-color: #fffaf6; padding: 28px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.05);">
                  <h2 style="margin-top:0;">Hello ${landlordFirst},</h2>
                  <h3 style="color:#FF6F61; margin-bottom:8px;">Tenant payment received</h3>
                  <p style="line-height:1.6;">We have received a confirmed payment of <strong>KES ${amount}</strong> for <strong>${propertyTitle}</strong>. The funds will be held in escrow until the tenant confirms after the tour.</p>
                  <p style="margin-top:18px;">Regards,<br/><strong>The Dwelify Team</strong></p>
                  <hr style="margin:20px 0; border-top:1px solid #eee;" />
                  <p style="font-size:12px; color:#777;">You will receive another email when funds are released to you (after tenant confirmation).</p>
                </div>
              </div>`;
            await sendEmail({ to: landlordEmail, subject: 'Tenant payment received — Dwelify', html: landlordHtml });
          }

          console.log('[mpesaCallback] Confirmation emails sent for txn', updatedTxn._id);
        } catch (emailErr) {
          console.warn('[mpesaCallback] Error sending confirmation emails:', emailErr);
        }
      } else {
        if (newStatus !== 'SUCCESS') {
          console.log('[mpesaCallback] Transaction failed (ResultCode != 0), no confirmation emails sent.');
        } else {
          console.log('[mpesaCallback] Transaction already marked SUCCESS previously; skipping confirmation emails.');
        }
      }
    }
  } catch (err) {
    console.error('[mpesaCallback] Error during DB update or emit:', err);
  }

  // Reply to Safaricom promptly
  res.status(200).json({ message: 'Callback processed' });
};

module.exports = { handleMpesaCallback };
