const Otp = require('../models/Otp');

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit code
}

async function sendOtp(phone) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Remove any previous unexpired codes for this phone, then store the new one
  await Otp.deleteMany({ phone });
  await Otp.create({ phone, code, expiresAt });

  // --- DEVELOPMENT MODE ---
  // Prints the OTP to your terminal so you can test without paying for SMS.
  // --- PRODUCTION ---
  // Replace this block with a real SMS provider call, e.g. MSG91, Twilio, or Firebase Phone Auth.
  //   await twilioClient.messages.create({ to: phone, from: TWILIO_NUMBER, body: `Your KisanMitra OTP is ${code}` });
  console.log(`[DEV OTP] ${phone} -> ${code} (expires in 5 min)`);

  return { sent: true };
}

async function verifyOtp(phone, code) {
  const record = await Otp.findOne({ phone });

  if (!record) {
    return { valid: false, reason: 'No OTP was requested for this number, or it already expired.' };
  }
  if (record.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: record._id });
    return { valid: false, reason: 'OTP expired. Please request a new one.' };
  }
  if (record.attempts >= 5) {
    await Otp.deleteOne({ _id: record._id });
    return { valid: false, reason: 'Too many incorrect attempts. Please request a new OTP.' };
  }
  if (record.code !== code) {
    record.attempts += 1;
    await record.save();
    return { valid: false, reason: 'Incorrect OTP.' };
  }

  await Otp.deleteOne({ _id: record._id });
  return { valid: true };
}

module.exports = { sendOtp, verifyOtp };
