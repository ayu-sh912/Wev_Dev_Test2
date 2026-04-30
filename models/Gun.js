const mongoose = require('mongoose');

const gunSchema = new mongoose.Schema(
  {
    gunName: {
      type: String,
      required: true,
      trim: true,
      immutable: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    automatic: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Gun', gunSchema);
