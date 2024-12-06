const mongoose = require('mongoose');
const { Schema } = mongoose;

const billSchema = new Schema({
  apptransid: {
    type: String,
    unique: true,
  },
  field_availability_id: { 
    type: Schema.Types.ObjectId, // Tham chiếu đến Field_Availability
    ref: 'Field_Availability',
  },
  user_id: { 
    type: Schema.Types.ObjectId, // Tham chiếu đến User
    ref: 'User',
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

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
