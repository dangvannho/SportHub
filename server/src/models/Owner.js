const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
    business_name: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_picture: { type: String },
    citizen_identification_card: { type: String },
    account_status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    payment_keys: {
        client_id: { type: String, required: false }, // PAYOS_CLIENT_ID
        api_key: { type: String, required: false },   // PAYOS_API_KEY
        checksum_key: { type: String, required: false } // PAYOS_CHECKSUM_KEY
    }
}, { timestamps: true });

module.exports = mongoose.model('Owner', OwnerSchema);
