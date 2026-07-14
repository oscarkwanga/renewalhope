// routes/usersrouter.js
const express = require('express');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const crypto = require('crypto');
const Users = require('../models/User'); // Ensure this path is correct
const router = express.Router();
const { getSocket } = require('../socket'); // Import `io` from the main server file
const users = require('../models/User');
const { Types } = require('mongoose');
const multer = require('multer');
const { streamUpload } = require('../cloudinaryUpload'); // <-- Cloudinary helper

// Resend client (email sending)
const {Resend} = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple email helper using Resend
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
    // Log but do not throw: email failures should not break user flows
    console.error('Failed to send email via Resend:', err?.response?.data || err?.message || err);
  }
}

// --- Multer memory storage (files uploaded to Cloudinary from buffer) ---
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Signup route
router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password, contact } = req.body;

  try {
    // Validate input
    if (!firstname || !lastname || !email || !password || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      console.log('User already exists with this email');
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new Users({ lastname, firstname, email, password: hashedPassword, contact });
    await newUser.save();

    const io = getSocket();
    io.emit('adduser', newUser);

    /*
    try {
      const html = `
        <h2>Welcome to Dwelify, ${firstname} 👋</h2>
        <p>Thanks for signing up. We're glad to have you on board.</p>
        <p>If you ever need help, reply to this email or visit the app.</p>
        <p>— The Dwelify Team</p>
      `;
      await sendEmail({ to: email, subject: 'Welcome to Dwelify!', html });
    } catch (e) {
      console.warn('Welcome email failed (signup):', e);
    }
*/
    console.log('Signup successful:', newUser);
    res.status(201).json({ message: 'User added successfully', user: { email: newUser.email, contact, firstname: newUser.firstname, lastname: newUser.lastname } });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'New user could not be added', error: error.message });
  }
});

// --- Existing signin route (sends first-login welcome email) ---
router.post('/signin', async (req, res) => {
  try {
    const { email, password, token } = req.body;
    console.log(req.body);
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await Users.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    // If there's a token and it's different from what's in the DB, update it
    if (token && token !== user.token) {
      user.token = token;
      await user.save();
      console.log('> Updated push token for user:', token);
    }


      // Send welcome email if this is the first login (no lastLogin recorded)
    try {
      if (!user.lastLogin) {
        const html = `
  <div style="
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f7f9fc;
    padding: 30px;
    color: #333333;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    ">
      <h2 style="margin-top: 0;">Dear ${user.firstname || 'Valued User'},</h2>

      <h3 style="color: #FF6F61; margin-bottom: 16px;">
        Welcome to Dwelify
      </h3>

      <p style="line-height: 1.7;">
        We’re glad to have you join a platform designed to simplify house hunting and property listing in Kenya.
        Our mission is to connect landlords and tenants through a trusted, transparent, and efficient real estate experience.
      </p>

      <p style="line-height: 1.7;">
        Whether you are searching for your next home or listing a property, Dwelify is here to make the process easier,
        safer, and more reliable.
      </p>

      <p style="margin-top: 30px;">
        Thank you for choosing Dwelify.
      </p>

      <p style="margin-top: 24px;">
        Regards,<br />
        <strong>The Dwelify Team</strong>
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;" />

      <p style="font-size: 12px; color: #777777;">
        This email was sent to you because you signed up for Dwelify.
        If you have any questions, simply reply to this email — we’re happy to help.
      </p>
    </div>
  </div>
`;

        await sendEmail({ to: user.email, subject: 'Welcome to Dwelify — First login', html });

        // mark lastLogin so we don't send again
        user.lastLogin = new Date();
      } else {
        // update last login timestamp
        user.lastLogin = new Date();
      }
      await user.save();
    } catch (e) {
      console.warn('Failed to send first-login welcome or update lastLogin:', e);
    }

    return res.status(200).json({
      message: 'Signin successful',
      user: {
        _id: user._id,
        email: user.email,
        token: user.token
      }
    });
  } catch (err) {
    console.error('Signin error:', err);
    return res
      .status(500)
      .json({ message: 'Could not complete the signin', error: err.message });
  }
});

/*
  NEW: POST /auth/oauth
  - Verifies Google id_token (preferred) or access token (fallback)
  - Finds existing user by verified email or creates a new user
  - Saves/updates push token (expoToken) and sets loged = true
  - Returns the user object (same shape as /signin)
*/
router.post('/oauth', async (req, res) => {
  try {
    const { provider, token, id_token, email, name, expoToken, location } = req.body;

    if (!provider || provider !== 'google') {
      return res.status(400).json({ message: 'Unsupported or missing OAuth provider' });
    }

    // 1) Verify id_token if present (recommended). If not present, verify access token by calling userinfo.
    let googleProfile = null;

    if (id_token) {
      // Verify id_token with Google's tokeninfo endpoint
      const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`;
      try {
        const tokenInfoRes = await axios.get(tokenInfoUrl);
        // tokenInfoRes.data contains email, email_verified, name, sub (google id), picture, etc.
        googleProfile = tokenInfoRes.data;
      } catch (err) {
        console.warn('Google id_token verification failed', err?.response?.data || err.message);
        return res.status(400).json({ message: 'Invalid id_token' });
      }
    } else if (token) {
      // fallback: use access token to get profile
      try {
        const profileRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        googleProfile = profileRes.data;
      } catch (err) {
        console.warn('Google access token verification failed', err?.response?.data || err.message);
        return res.status(400).json({ message: 'Invalid access token' });
      }
    } else {
      return res.status(400).json({ message: 'No token provided' });
    }

    // Use email from verified Google profile instead of trusting client-provided email
    const verifiedEmail = (googleProfile && (googleProfile.email || googleProfile.email_address)) || email;
    if (!verifiedEmail) return res.status(400).json({ message: 'Google profile has no email' });

    // 2) Find existing user or create new one
    let user = await Users.findOne({ email: verifiedEmail });

    if (user) {
      // update push token if provided
      if (expoToken && expoToken !== user.token) {
        user.token = expoToken;
      }
      // optionally update name fields if missing
      if (!user.firstname && name) {
        const nameParts = String(name).split(' ');
        user.firstname = nameParts[0];
        user.lastname = nameParts.slice(1).join(' ');
      }
      user.loged = true;
      await user.save();

      return res.status(200).json({ message: 'Signin successful', user });
    }

    // 3) Create new user (for users signing in with Google for the first time)
    const nameParts = String(name || '').split(' ');
    const firstname = nameParts[0] || '';
    const lastname = nameParts.slice(1).join(' ') || '';

    const newUser = new Users({
      firstname,
      lastname,
      email: verifiedEmail,
      password: '',        // empty - manual signin remains separate
      token: expoToken || '',
      loged: true,
      role: 'user'
    });

    await newUser.save();

    const io = getSocket();
    io.emit('adduser', newUser);

    // send welcome email for oauth-created users
    try {
      const html = `
          <div style="
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f7f9fc;
    padding: 30px;
    color: #333333;
  ">
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    ">
      <h2 style="margin-top: 0;">Dear ${user.firstname || 'Valued User'},</h2>

      <h3 style="color: #FF6F61; margin-bottom: 16px;">
        Welcome to Dwelify
      </h3>

      <p style="line-height: 1.7;">
        We’re glad to have you join a platform designed to simplify house hunting and property listing in Kenya.
        Our mission is to connect landlords and tenants through a trusted, transparent, and efficient real estate experience.
      </p>

      <p style="line-height: 1.7;">
        Whether you are searching for your next home or listing a property, Dwelify is here to make the process easier,
        safer, and more reliable.
      </p>

      <p style="margin-top: 30px;">
        Thank you for choosing Dwelify.
      </p>

      <p style="margin-top: 24px;">
        Regards,<br />
        <strong>The Dwelify Team</strong>
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;" />

      <p style="font-size: 12px; color: #777777;">
        This email was sent to you because you signed up for Dwelify.
        If you have any questions, simply reply to this email — we’re happy to help.
      </p>
    </div>
  </div>
      `;
      await sendEmail({ to: newUser.email, subject: 'Welcome to Dwelify!', html });
    } catch (e) {
      console.warn('Welcome email failed (oauth creation):', e);
    }

    return res.status(201).json({ message: 'User created via Google', user: newUser });
  } catch (err) {
    console.error('OAuth endpoint error', err);
    return res.status(500).json({ message: 'OAuth signin failed', error: err.message });
  }
});

// Delete route
router.delete('/delete', async (req, res) => {
  try {
    const result = await Users.deleteMany({});
    console.log('Data delete success');
    res.status(200).json({ message: 'All users deleted successfully', deletedCount: result.deletedCount });
  } catch (err) {
    console.error('Error during delete process:', err);
    res.status(500).json({ message: 'Could not complete the delete process', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await Users.find().sort({ createdAt: -1 });
    res.status(200).json(result);
  } catch (err) {
    console.error('Error during process:', err);
    res.status(500).json({ message: 'Could not complete the requestprocess', error: err.message });
  }
});

// function to save the onboarding
router.put('/onboarding', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      console.log('No ID found');
      return res.status(400).json({ message: 'No ID found' });
    }
    const updatedUser = await Users.findOneAndUpdate(
      email,
      { loged: true },
      { new: true }
    );
    console.log('User updated successfully');
    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: 'Could not complete the request process',
      error: err.message,
    });
  }
});

// update user (now uploads coverimage to Cloudinary)
router.put('/', upload.single('coverimage'), async (req, res) => {
  try {
    const { space, email ,firstname,lastname,contact} = req.body;
  

    // Find the user by email
    const existingUser = await Users.findOne({ email: email });
    if (!existingUser) {
      console.log('User does not exist');
      return res.status(404).json({ message: 'User does not exist' });
    }

    // Update fields accordingly
    if (space) {
      existingUser.space = space;
    }
    if (firstname) {
      existingUser.firstname = firstname;
    }
    if (lastname) {
      existingUser.lastname = lastname;
    }
    if (contact) {
      existingUser.contact = contact;
    }

    // If a file was uploaded, stream it to Cloudinary from the buffer
    if (req.file && req.file.buffer) {
      try {
        // safe public id
        const publicId = `user_cover/${existingUser._id}_${Date.now()}`;
        const result = await streamUpload(req.file.buffer, 'user_profiles', publicId);

        // store the secure url as the coverimage (minimal change)
        existingUser.coverimage = result.secure_url;
        console.log('Cloudinary upload successful:', result.secure_url);
      } catch (uploadErr) {
        console.error('Failed uploading coverimage to Cloudinary:', uploadErr);
        return res.status(500).json({ message: 'Error uploading cover image', error: uploadErr.message || uploadErr.toString() });
      }
    }

    // Save user to the database
    await existingUser.save();
    console.log('User updated successfully:', existingUser);

    // Emit updated user info via sockets
    const io = getSocket();
    io.emit('getuser', existingUser);

    // Return the user's _id (same behavior as before)
    res.status(200).json(existingUser._id);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      message: 'User could not be updated',
      error: error.message,
    });
  }
});

// find one user
router.get('/one/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Users.findById(id);
    console.log('found', result);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error during process:', err);
    res.status(500).json({ message: 'Could not complete the requestprocess', error: err.message });
  }
});

// find one user by email
router.get('/single/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const result = await Users.findOne({ email: email });
    console.log('found', result);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error during process:', err);
    res.status(500).json({ message: 'Could not complete the requestprocess', error: err.message });
  }
});

router.get('/notifications/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const person = await Users.findById(userid);

    if (!person) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (Array.isArray(person.notifications)) {
      person.notifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    res.status(200).json(person);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// DELETE /deleteone/:userid/:notificationId
router.delete('/deleteone/:userid/:notificationId', async (req, res) => {
  try {
    const { userid, notificationId } = req.params;
    console.log('Backend: Attempting to delete notification:', notificationId, 'for user:', userid);

    const updatedUser = await Users.findByIdAndUpdate(
      userid,
      { $pull: { notifications: { _id: notificationId } } },
      { new: true }
    );
    if (!updatedUser) {
      console.log('Backend: User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });

    const io = getSocket();
    io.emit('deletenotification', notificationId.toString());
  } catch (err) {
    console.error('Backend: Error deleting notification:', err);
    res.status(500).json({ message: 'Error deleting notification', error: err.message });
  }
});

// function to delete notifications at once
router.delete('/deleteall/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const updatedUser = await Users.findByIdAndUpdate(
      userid,
      { $set: { notifications: [] } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const io = getSocket();
    io.emit('notification', updatedUser);
    console.log(updatedUser);
    res.status(200).json({
      message: 'All notifications deleted successfully',
      notifications: updatedUser.notifications
    });
  } catch (err) {
    console.error('Error deleting notifications:', err);
    res.status(500).json({
      message: 'Could not delete notifications',
      error: err.message
    });
  }
});

/*
  PASSWORD RESET FLOW
  - POST /forgot-password  { email } -> generate token, save to user, email reset link
  - POST /reset-password   { email, token, newPassword } -> verify and update password
*/

// POST /forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });

    // create token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 1000 * 60 * 60; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    // build reset link (frontend should have a page to handle this)
    const frontend = process.env.FRONTEND_URL || 'https://your-frontend-url.com';
    const resetLink = `${frontend.replace(/\/$/, '')}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    const html = `
      <h2>Password reset request</h2>
      <p>Hi ${user.firstname || ''},</p>
      <p>We received a request to reset your password. Click the link below to reset it (valid for 1 hour):</p>
      <p><a href="${resetLink}">Reset your password</a></p>
      <p>If you didn't request this, you can safely ignore this message.</p>
      <p>— The Dwelify Team</p>
    `;

    await sendEmail({ to: user.email, subject: 'Dwelify password reset', html });

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('forgot-password error:', err);
    return res.status(500).json({ message: 'Could not process password reset', error: err.message });
  }
});

// POST /reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'Email, token and newPassword are required' });
    }

    const user = await Users.findOne({ email, resetPasswordToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid token or email' });

    if (!user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Token has expired. Please request a new password reset.' });
    }

    // hash and set the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;

    // clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // send confirmation email
    const html = `
      <h2>Password changed</h2>
      <p>Hi ${user.firstname || ''},</p>
      <p>Your password has been changed successfully. If this wasn't you, contact support immediately.</p>
      <p>— The Dwelify Team</p>
    `;
    await sendEmail({ to: user.email, subject: 'Your Dwelify password has been changed', html });

    return res.status(200).json({ message: 'Password has been reset' });
  } catch (err) {
    console.error('reset-password error:', err);
    return res.status(500).json({ message: 'Could not reset password', error: err.message });
  }
});



//function to delete a user
// DELETE /auth/:id  (delete a single user)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // validate id quickly
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await Users.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally: remove user assets from cloudinary here if you store public_id

    // notify connected clients
    const io = getSocket();
    try {
      io.emit('deleteuser', id.toString());
    } catch (e) {
      console.warn('Failed to emit deleteuser socket event', e);
    }

    console.log(`User deleted: ${id}`);
    return res.status(200).json({ message: 'User deleted', id });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ message: 'Could not delete user', error: err.message });
  }
});


module.exports = router;
