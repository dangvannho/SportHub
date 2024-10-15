const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    account_status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    user_role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profile_picture: { type: String },
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
