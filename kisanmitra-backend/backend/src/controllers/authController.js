const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function issueToken(user) {
  return jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function register(req, res) {
  try {
    const { phone, name, role, villageOrBusinessName, location, state, language, email, businessType, password } = req.body;
    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !name?.trim() || !role || !villageOrBusinessName?.trim() || !location?.trim() || !state || !password) return res.status(400).json({ error: 'Name, valid phone, role, location and password are required.' });
    if (!['farmer', 'buyer'].includes(role)) return res.status(400).json({ error: 'Role must be farmer or buyer.' });
    if (password.length < 6) return res.status(422).json({ error: 'Password must contain at least 6 characters.' });
    const existingPhone = await User.findOne({ phone: cleanPhone });
    if (existingPhone) return res.status(409).json({ error: 'An account with this phone number already exists. Please log in.' });
    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingEmail) return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ phone: cleanPhone, name: name.trim(), role, villageOrBusinessName: villageOrBusinessName.trim(), location: location.trim(), state, language: language || 'en', email: email?.toLowerCase().trim(), businessType, passwordHash, isVerified: true });
    res.status(201).json({ token: issueToken(user), user: user.toPublicJSON() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create account.' });
  }
}

async function loginWithPassword(req, res) {
  try {
    const { phone, email, password } = req.body;
    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : null;
    const query = email ? { email: email.toLowerCase().trim() } : { phone: cleanPhone };
    const user = await User.findOne(query);
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid login credentials.' });
    const match = await bcrypt.compare(password || '', user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid login credentials.' });
    res.json({ token: issueToken(user), user: user.toPublicJSON() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to sign in.' });
  }
}

async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: user.toPublicJSON() });
}

module.exports = { register, loginWithPassword, me };
