const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
    business_name: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    profile_picture: { type: String },
    citizen_identification_card: { type: String },
    account_status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Owner', OwnerSchema);
