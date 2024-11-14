const mongoose = require('mongoose');

const FieldAvailabilitySchema = new mongoose.Schema({
    //availability_id: { type: mongoose.Schema.Types.ObjectId, required: true },  // Foreign Key từ bảng Field
    field_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },  // Foreign Key từ bảng Field
    price_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Field.price', required: true },
    availability_date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    is_available: { type: Boolean, default: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('FieldAvailability', FieldAvailabilitySchema);
