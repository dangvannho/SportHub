const Comment = require("../models/Comment");
const { authenticateUser } = require("../utils/checkOwner");
const socketIO = require("../socket");

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
      .populate("user_id", "name profile_picture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      EC: 1,
      EM: "Lấy comments thành công",
      comments,
    });
  } catch (error) {
    res.status(500).json({
      EC: 0,
      EM: error.message,
    });
  }
};

// Thêm comment mới với Socket.io
const addComment = async (req, res) => {
  try {
    const { field_id, comment_text } = req.body;
    const user_id = authenticateUser(req);

    if (!user_id) {
      return res.status(401).json({
        EC: 0,
        EM: "Unauthorized",
      });
    }

    const newComment = new Comment({
      user_id,
      field_id,
      comment_text,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      "user_id",
      "name profile_picture"
    );

    // Emit new comment to all clients in the field room
    io.to(`field_${field_id}`).emit("newComment", populatedComment);

    res.status(201).json({
      EC: 1,
      EM: "Thêm comment thành công",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      EC: 0,
      EM: error.message,
    });
  }
};

// Xóa comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = authenticateUser(req);

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        EC: 0,
        EM: "Comment không tồn tại",
      });
    }

    if (comment.user_id.toString() !== user_id) {
      return res.status(403).json({
        EC: 0,
        EM: "Không có quyền xóa comment này",
      });
    }

    await Comment.findByIdAndDelete(id);

    const io = getSocketIO();
    if (io) {
      io.to(`field_${comment.field_id}`).emit("deleteComment", id);
    }

    res.status(200).json({
      EC: 1,
      EM: "Xóa comment thành công",
    });
  } catch (error) {
    res.status(500).json({
      EC: 0,
      EM: error.message,
    });
  }
};

// Cập nhật comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment_text } = req.body;
    const user_id = authenticateUser(req);

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        EC: 0,
        EM: "Comment không tồn tại",
      });
    }

    if (comment.user_id.toString() !== user_id) {
      return res.status(403).json({
        EC: 0,
        EM: "Không có quyền sửa comment này",
      });
    }

    comment.comment_text = comment_text;
    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "user_id",
      "name profile_picture"
    );

    // Emit update event
    io.to(`field_${comment.field_id}`).emit("updateComment", populatedComment);

    res.status(200).json({
      EC: 1,
      EM: "Cập nhật comment thành công",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      EC: 0,
      EM: error.message,
    });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user_id", "name profile_picture")
      .populate("field_id", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      EC: 1,
      EM: "Lấy danh sách comments thành công",
      comments,
    });
  } catch (error) {
    res.status(500).json({
      EC: 0,
      EM: error.message,
    });
  }
};

module.exports = {
  getFieldComments,
  addComment,
  deleteComment,
  updateComment,
  getAllComments,
};
