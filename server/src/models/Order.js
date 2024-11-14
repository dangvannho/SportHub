const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  apptransid: {
    type: String,
    required: true,
    unique: true
  },
//   User_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', 
//     required: true,
//   },
  description: {
    type: String
  },
  amount: {
    type: Number
  },
  apptime: {
    type: Number
  },
  
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
