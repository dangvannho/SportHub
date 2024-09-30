const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },  // Foreign Key từ bảng Owner
    field_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },  // Foreign Key từ bảng Field
    tournament_name: { type: String, required: true },
    description: { type: String },
    registration_start: { type: Date, required: true },
    registration_end: { type: Date, required: true },
    tournament_date: { type: Date, required: true },
    participants_limit: { type: Number, required: true },
    fee: { type: Number, required: true },
    images: { type: [String] }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', TournamentSchema);
