const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { initSocket } = require('./socket');

require("dotenv").config();
const sermons= require('./routes/sermonrouter');
const ministries = require('./routes/ministryrouter');
const events = require('./routes/eventrouter');
const stories = require('./routes/storyrouter');
const authentication = require('./routes/usersrouter');










const app = express();

// --- Middleware Setup ---
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://alfahomes.onrender.com',
    'https://admindwelify.onrender.com',
    'https://dwelify.xyz',
    'https://www.dwelify.xyz'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Resend email helper (used for payment/reservation notifications) ---
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }) {
  try {
    const from = process.env.RESEND_FROM || 'Dwelify <no-reply@dwelify.xyz>';
    await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to} — ${subject}`);
  } catch (err) {
    console.error('Failed to send email via Resend:', err?.response?.data || err?.message || err);
    // do not throw — keep flow stable if emails fail
  }
}









// --- Routes ---

app.use('/api/sermons', sermons);
app.use('/api/ministries', ministries);
app.use('/api/events', require('./routes/eventrouter'));
app.use('/api/stories', require('./routes/storyrouter'));
app.use('/api/milestones', require('./routes/milestonerouter'));
app.use('/api/pastors', require('./routes/pastorrouter'));
app.use('/api/cultures', require('./routes/culturerouter'));
app.use('/api/constructions', require('./routes/constructionrouter'));
app.use('/auth', authentication);
app.use("/api/paypal", require("./routes/paypalrouter"));





// --- Database and Server Setup ---
const port = process.env.PORT || 3001;
const connect = process.env.ATLAS;

mongoose.connect(connect)
  .then(() => console.log('[server.js]  Database connected successfully'))
  .catch(err => console.error('[server.js]  Database connection error:', err));

const server = http.createServer(app);
initSocket(server); // Setup socket with CORS and websocket config

server.listen(port, () => {
  console.log(`[server.js] 🚀 Server is running on port ${port}`);
});
