const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['farmer', 'buyer'], required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, lowercase: true, trim: true },
    passwordHash: { type: String }, // set after OTP verification if user chooses a password
    villageOrBusinessName: { type: String, required: true },
    location: { type: String, required: true },
    state: { type: String, required: true },
    language: { type: String, enum: ['en', 'te', 'hi', 'ta', 'mr'], default: 'en' },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    completedOrdersCount: { type: Number, default: 0 },
    avatarUrl: { type: String },
    cropsGrownOrPurchased: [{ type: String }],
    businessType: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

// Never leak the password hash to the frontend
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
