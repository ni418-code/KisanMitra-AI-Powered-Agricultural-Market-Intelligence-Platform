const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientRole: { type: String, enum: ['farmer', 'buyer', 'all'], default: 'all' },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['requirement', 'order', 'pickup', 'payment', 'system'],
      default: 'system',
    },
    actionUrl: String,
    relatedId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
