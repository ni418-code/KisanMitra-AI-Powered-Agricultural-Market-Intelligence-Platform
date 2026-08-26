const mongoose = require('mongoose');

// Short-lived OTP codes for phone login/registration.
// In production, swap the console.log "sender" in otpService.js for a real SMS provider (MSG91, Twilio, Firebase).
const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
});

// Auto-delete expired OTP documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);
