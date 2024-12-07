const express = require("express");
const router = express.Router();
const { getFieldComments, addComment, deleteComment, getAllComments, updateComment, getFieldRatingAverage, getFieldRatingStats, } = require("../controllers/CommentController");
const middlewareController = require("../controllers/middlewareControler");

// Lấy tất cả comments của một sân
router.get("/:field_id", getFieldComments);

// Lấy tất cả comments
router.get('/', getAllComments);

// Thêm comment mới (yêu cầu đăng nhập)
router.post("/", middlewareController.verifyToken, addComment);
// Cập nhật comment (yêu cầu đăng nhập)
router.put("/:id", middlewareController.verifyToken, updateComment);
// Xóa comment (yêu cầu đăng nhập)
router.delete("/:id", middlewareController.verifyToken, deleteComment);

router.get('/stats/:field_id', getFieldRatingStats);

router.get('/average/:field_id', getFieldRatingAverage);


module.exports = router;