const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    field_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment_text: { type: String, required: true }
}, { timestamps: true });

// Xóa tất cả các index hiện có
//CommentSchema.index({ user_id: 1, field_id: 1 }, { unique: false });

module.exports = mongoose.model('Comment', CommentSchema);
