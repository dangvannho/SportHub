const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  startHour: { type: String, required: true },
  endHour: { type: String, required: true },
  price: { type: Number, required: true },
  is_weekend: { type: Boolean, required: true }
});

const FieldSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner', 
      required: true,
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
    availability_status: { type: Boolean, default: true },
    images: { type: [String] },
    price: [priceSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Field', FieldSchema);