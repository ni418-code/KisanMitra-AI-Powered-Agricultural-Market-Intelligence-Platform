const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendOtp, verifyOtp } = require('../utils/otpService');

function issueToken(user) {
  return jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

// STEP 1 of login/registration: request an OTP for a phone number
async function requestOtp(req, res) {
  const { phone } = req.body;
  if (!phone || phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Please provide a valid 10-digit phone number.' });
  }
  await sendOtp(phone);
  res.json({ message: 'OTP sent. Check your phone (or the server console in dev mode).' });
}

// STEP 2: verify the OTP. If the phone belongs to an existing user, log them in.
// If not, tell the frontend this is a NEW user so it can show the registration form.
async function verifyOtpAndLogin(req, res) {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and OTP code are required.' });
  }

  const result = await verifyOtp(phone, code);
  if (!result.valid) {
    return res.status(400).json({ error: result.reason });
  }

  const existingUser = await User.findOne({ phone });
  if (!existingUser) {
    return res.json({ newUser: true, phone });
  }

  const token = issueToken(existingUser);
  res.json({ newUser: false, token, user: existingUser.toPublicJSON() });
}

// Called right after a successful OTP verification for a brand-new phone number
async function register(req, res) {
  const {
    phone,
    name,
    role,
    villageOrBusinessName,
    location,
    state,
    language,
    email,
    businessType,
    password,
  } = req.body;

  if (!phone || !name || !role || !villageOrBusinessName || !location || !state) {
    return res.status(400).json({ error: 'Missing required registration fields.' });
  }
  if (!['farmer', 'buyer'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "farmer" or "buyer".' });
  }

  const existing = await User.findOne({ phone });
  if (existing) {
    return res.status(409).json({ error: 'An account with this phone number already exists. Please log in.' });
  }

  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

  const user = await User.create({
    phone,
    name,
    role,
    villageOrBusinessName,
    location,
    state,
    language: language || 'en',
    email,
    businessType,
    passwordHash,
    isVerified: true, // phone was OTP-verified to reach this endpoint
  });

  const token = issueToken(user);
  res.status(201).json({ token, user: user.toPublicJSON() });
}

// Optional password-based login for returning users who set a password (fingerprint/PIN
// unlock happens client-side; the app only re-calls this endpoint when the session token expires)
async function loginWithPassword(req, res) {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: 'No password set for this account. Please log in with OTP.' });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  const token = issueToken(user);
  res.json({ token, user: user.toPublicJSON() });
}

async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: user.toPublicJSON() });
}

module.exports = { requestOtp, verifyOtpAndLogin, register, loginWithPassword, me };
