const Comment = require('../models/Comment');
const Bill = require('../models/Bill');
const { authenticateUser } = require("../utils/checkOwner");
const socketIO = require('../socket');
const User = require('../models/User');
const mongoose = require('mongoose');

// Remove the immediate io initialization
let io;

// Add this function to get io instance
const getSocketIO = () => {
    if (!io) {
        io = socketIO.getIO();
    }
    return io;
};

// Lấy tất cả comments của một sân
const getFieldComments = async (req, res) => {
    try {
        const { field_id } = req.params;
        const comments = await Comment.find({ field_id })
            .populate({
                path: 'user_id',
                select: 'name profile_picture bills',
                populate: {
                    path: 'bills',
                    match: {
                        field_id,
                        status: 'complete'
                    },
                    select: 'order_time'
                }
            })
            .sort({ createdAt: -1 });

        const commentsWithOrderTime = comments.map(comment => {
            const userBills = comment.user_id.bills || [];
            const latestBill = userBills.length > 0 ? userBills[0] : null;

            return {
                _id: comment._id,
                user_id: {
                    _id: comment.user_id._id,
                    name: comment.user_id.name,
                    profile_picture: comment.user_id.profile_picture
                },
                field_id: comment.field_id,
                rating: comment.rating,
                comment_text: comment.comment_text,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                order_time: latestBill ? latestBill.order_time : null
            };
        });

        res.status(200).json({
            EC: 1,
            EM: "Lấy comments thành công",
            comments: commentsWithOrderTime
        });
    } catch (error) {
        console.error('Error in getFieldComments:', error);
        res.status(500).json({
            EC: 0,
            EM: error.message
        });
    }
};

// Thêm comment mới với Socket.io
const addComment = async (req, res) => {
    try {
        const { field_id, comment_text, rating } = req.body;
        const user_id = req.user.id;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                EC: 0,
                EM: "Rating phải từ 1 đến 5 sao"
            });
        }

        // Validate comment text
        if (!comment_text || comment_text.trim().length === 0) {
            return res.status(400).json({
                EC: 0,
                EM: "Nội dung bình luận không được để trống"
            });
        }

        // Check if user already commented
        // const existingComment = await Comment.findOne({ user_id, field_id });
        // if (existingComment) {
        //     return res.status(400).json({
        //         EC: 0,
        //         EM: "Bạn đã bình luận cho sân này rồi"
        //     });
        // }

        const newComment = new Comment({
            user_id,
            field_id,
            comment_text,
            rating
        });

        const savedComment = await newComment.save();
        const populatedComment = await Comment.findById(savedComment._id)
            .populate('user_id', 'name profile_picture');

        // Emit socket event
        const io = getSocketIO();
        if (io) {
            io.to(`field_${field_id}`).emit('receiveComment', populatedComment);
        }

        res.status(201).json({
            EC: 1,
            EM: "Thêm bình luận thành công",
            comment: populatedComment
        });

    } catch (error) {
        console.error('Error in addComment:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                EC: 0,
                EM: "Bạn đã bình luận cho sân này rồi"
            });
        }
        res.status(500).json({
            EC: 0,
            EM: error.message
        });
    }
};

// Xóa comment
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = authenticateUser(req);

        if (!user_id) {
            return res.status(401).json({
                EC: 0,
                EM: "Unauthorized"
            });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                EC: 0,
                EM: "Comment không tồn tại"
            });
        }

        if (comment.user_id.toString() !== user_id) {
            return res.status(403).json({
                EC: 0,
                EM: "Không có quyền xóa comment này"
            });
        }

        await Comment.deleteOne({ _id: id });

        const io = getSocketIO();
        if (io) {
            io.to(`field_${comment.field_id}`).emit('deleteComment', id);
        }

        res.status(200).json({
            EC: 1,
            EM: "Xóa comment thành công"
        });
    } catch (error) {
        console.error('Error in deleteComment:', error);
        res.status(500).json({
            EC: 0,
            EM: error.message
        });
    }
};

// Cập nhật comment
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment_text, rating } = req.body;
        const user_id = authenticateUser(req);

        if (!user_id) {
            return res.status(401).json({
                EC: 0,
                EM: "Unauthorized"
            });
        }

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                EC: 0,
                EM: "Comment không tồn tại"
            });
        }

        if (comment.user_id.toString() !== user_id) {
            return res.status(403).json({
                EC: 0,
                EM: "Không có quyền sửa comment này"
            });
        }

        if (!comment_text || comment_text.trim().length === 0) {
            return res.status(400).json({
                EC: 0,
                EM: "Nội dung bình luận không được để trống"
            });
        }

        if (rating !== undefined) {
            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                return res.status(400).json({
                    EC: 0,
                    EM: "Rating phải là số nguyên từ 1 đến 5"
                });
            }
            comment.rating = rating;
        }

        comment.comment_text = comment_text;
        await comment.save();

        const populatedComment = await Comment.findById(comment._id)
            .populate('user_id', 'name profile_picture');

        const io = getSocketIO();
        if (io) {
            io.to(`field_${comment.field_id}`).emit('updateComment', populatedComment);
        }

        res.status(200).json({
            EC: 1,
            EM: "Cập nhật comment thành công",
            comment: populatedComment
        });
    } catch (error) {
        console.error('Error in updateComment:', error);
        res.status(500).json({
            EC: 0,
            EM: error.message
        });
    }
};

const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate('user_id', 'name profile_picture')
            .populate('field_id', 'name location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách comments thành công",
            comments
        });
    } catch (error) {
        res.status(500).json({
            EC: 0,
            EM: error.message
        });
    }
};

// API lấy trung bình số sao của một sân
const getFieldRatingAverage = async (req, res) => {
    try {
        const { field_id } = req.params;

        const result = await Comment.aggregate([
            { $match: { field_id: new mongoose.Types.ObjectId(field_id) } },
            {
                $group: {
                    _id: "$field_id",
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);

        const stats = result[0] || { averageRating: 0, totalRatings: 0 };

        res.status(200).json({
            EC: 1,
            EM: "Lấy thông tin đánh giá thành công",
            DT: {
                averageRating: Math.round(stats.averageRating * 10) / 10, // Làm tròn đến 1 chữ số thập phân
                totalRatings: stats.totalRatings
            }
        });
    } catch (error) {
        console.error('Error in getFieldRatingAverage:', error);
        res.status(500).json({
            EC: 0,
            EM: "Không thể lấy thông tin đánh giá",
            DT: error.message
        });
    }
};

// API lấy thống kê số lượng đánh giá theo số sao
const getFieldRatingStats = async (req, res) => {
    try {
        const { field_id } = req.params;

        const stats = await Comment.aggregate([
            { $match: { field_id: new mongoose.Types.ObjectId(field_id) } },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } } // Sắp xếp theo số sao giảm dần (5->1)
        ]);

        // Tạo object đầy đủ từ 1-5 sao
        const ratingStats = {
            5: 0, 4: 0, 3: 0, 2: 0, 1: 0
        };

        // Cập nhật số liệu thực tế
        stats.forEach(stat => {
            ratingStats[stat._id] = stat.count;
        });

        const totalComments = Object.values(ratingStats).reduce((a, b) => a + b, 0);

        res.status(200).json({
            EC: 1,
            EM: "Lấy thống kê đánh giá thành công",
            DT: {
                ratingStats,
                totalComments
            }
        });
    } catch (error) {
        console.error('Error in getFieldRatingStats:', error);
        res.status(500).json({
            EC: 0,
            EM: "Không thể lấy thống kê đánh giá",
            DT: error.message
        });
    }
};

module.exports = {
    getFieldComments,
    addComment,
    deleteComment,
    updateComment,
    getAllComments,
    getFieldRatingAverage,
    getFieldRatingStats
};