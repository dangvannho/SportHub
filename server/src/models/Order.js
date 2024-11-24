const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  apptransid: {
    type: String,
    required: true,
    unique: true
  },
  user_name: {
    type: String, 
  },
  user_email: {
    type: String, 
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
  },
  apptime: {
    type: Number,
  },
  order_time: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
