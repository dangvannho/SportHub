const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    field_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },  // Foreign Key từ bảng Field
    comment_text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
