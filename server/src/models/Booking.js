const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign Key từ bảng User
    field_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },  // Foreign Key từ bảng Field
    booking_date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    total_price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
