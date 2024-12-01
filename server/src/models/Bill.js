const mongoose = require('mongoose');
const { Schema } = mongoose;

const billSchema = new Schema({
  apptransid: {
    type: String,
    required: true,
    unique: true
  },
  field_id: {
    type: String,
    required: true
  },  
  user_id: { 
    type : String ,
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

const Bill = mongoose.model('bill', billSchema);
module.exports = Bill;
