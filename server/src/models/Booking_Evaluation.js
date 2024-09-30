const mongoose = require('mongoose');

const BookingEvaluationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Foreign Key từ bảng User
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },  // Foreign Key từ bảng Booking
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BookingEvaluation', BookingEvaluationSchema);
