const mongoose = require('mongoose');
const Field = require('./Field'); 

const OwnerSchema = new mongoose.Schema({
    business_name: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    email: { type: String, required: true , unique: true },
    password: { type: String, required: true },
    profile_picture: { type: String },
    citizen_identification_card: { type: String },
    account_status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' }
}, { timestamps: true });

// Middleware pre cho sự kiện findOneAndDelete
OwnerSchema.pre('findOneAndDelete', async function(next) {
    try {
        const ownerId = this.getQuery()._id;

        // Xoá tất cả các field có owner_id bằng ownerId
        await Field.deleteMany({ owner_id: ownerId });

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Owner', OwnerSchema);
