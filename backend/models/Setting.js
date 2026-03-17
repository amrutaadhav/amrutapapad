const mongoose = require('mongoose');

const settingSchema = mongoose.Schema(
  {
    offerText: {
      type: String,
      default: 'Festival Offer! Get 20% off on all Masala Papads this week! Use code: FESTIVAL20',
    },
    offerIsActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
