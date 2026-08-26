const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    requirementId: { type: mongoose.Schema.Types.ObjectId, ref: 'BuyerRequirement' },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerListing' },
    cropId: String,
    cropName: String,
    cropImage: String,
    quantity: Number,
    unit: { type: String, enum: ['kg', 'quintal'], default: 'kg' },
    agreedPricePerKg: Number,
    totalAmount: Number,

    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: String,
    farmerVillage: String,
    farmerPhone: String,
    farmerLocation: String,

    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyerName: String,
    buyerPhone: String,
    buyerLocation: String,
    buyerRating: Number,

    distanceKm: Number,

    status: {
      type: String,
      enum: ['posted', 'matched', 'accepted', 'pickup_scheduled', 'crop_picked_up', 'payment_completed'],
      default: 'posted',
    },

    pickupDetails: {
      scheduledDate: String,
      scheduledTimeWindow: String,
      driverName: String,
      driverPhone: String,
      vehicleNumber: String,
      transportStatus: {
        type: String,
        enum: ['Pickup Scheduled', 'Driver Assigned', 'On the Way', 'Picked Up'],
        default: 'Pickup Scheduled',
      },
      pickupAddress: String,
    },

    paymentDetails: {
      status: { type: String, enum: ['Pending', 'Payment Completed'], default: 'Pending' },
      method: String,
      amount: Number,
      transactionId: String,
      completedAt: String,
      breakdown: {
        quantity: Number,
        unit: String,
        ratePerKg: Number,
        totalAmount: Number,
        platformFee: Number,
        netPayoutToFarmer: Number,
      },
    },

    timeline: [
      {
        status: String,
        label: String,
        description: String,
        timestamp: String,
        completed: Boolean,
        current: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
