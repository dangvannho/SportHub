import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FaStar } from "react-icons/fa";
import "./Comment.scss";
import httpRequest from "~/utils/httpRequest";
import { toast } from "react-toastify";

const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true,
});

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval;

  if (seconds < 60) {
    return `${seconds} giây trước`;
  } else if (seconds < 3600) {
    interval = Math.floor(seconds / 60);
    return `${interval} phút trước`;
  } else if (seconds < 86400) {
    interval = Math.floor(seconds / 3600);
    return `${interval} giờ trước`;
  } else if (seconds < 31536000) {
    interval = Math.floor(seconds / 86400);
    return `${interval} ngày trước`;
  } else {
    interval = Math.floor(seconds / 31536000);
    return `${interval} năm trước`;
  }
};

function Comment({ fieldId, onRatingChange }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [editHover, setEditHover] = useState(0);
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalRatings: 0,
    ratingDetails: {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    }
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await httpRequest.get(`/api/comments/${fieldId}`);
      console.log("Comments response:", response);

      if (response && response.EC === 1) {
        setComments(response.comments);
      } else {
        toast.error("Không thể tải bình luận");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Lỗi khi tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fieldId) {
      socket.emit("joinRoom", fieldId);
      fetchComments();

      socket.on("receiveComment", (comment) => {
        console.log("Received comment:", comment);
        setComments((prev) => [comment, ...prev]);
      });

      socket.on("deleteComment", (commentId) => {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
      });

      socket.on("commentError", (error) => {
        toast.error(error);
      });

      socket.on("updateComment", (updatedComment) => {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === updatedComment._id ? updatedComment : comment
          )
        );
      });

      return () => {
        socket.off("receiveComment");
        socket.off("deleteComment");
        socket.off("commentError");
        socket.off("updateComment");
      };
    }
  }, [fieldId]);

  useEffect(() => {
    if (fieldId) {
      fetchRatingStats();
    }
  }, [fieldId]);

  const fetchRatingStats = async () => {
    try {
      const [averageRes, statsRes] = await Promise.all([
        httpRequest.get(`/api/comments/average/${fieldId}`),
        httpRequest.get(`/api/comments/stats/${fieldId}`)
      ]);

      if (averageRes.EC === 1 && statsRes.EC === 1) {
        setRatingStats({
          averageRating: averageRes.DT.averageRating,
          totalRatings: averageRes.DT.totalRatings,
          ratingDetails: statsRes.DT.ratingStats
        });
      }
    } catch (error) {
      console.error("Error fetching rating stats:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    if (rating === 0) {
      toast.error("Vui lòng đánh giá số sao");
      return;
    }

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    const user = JSON.parse(userStr);

    try {
      const response = await httpRequest.post('/api/comments', {
        field_id: fieldId,
        comment_text: newComment,
        rating: rating
      }, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      });

      if (response.EC === 1) {
        setNewComment("");
        setRating(0);
        toast.success(response.EM);
        onRatingChange && onRatingChange();
      } else {
        toast.error(response.EM || "Không thể thêm bình luận");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error.response?.data?.EM) {
        toast.error(error.response.data.EM);
      } else {
        toast.error("Không thể thêm bình luận");
      }
    }
  };

  const handleDeleteComment = async (_id) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Vui lòng đăng nhập để xóa bình luận");
        return;
      }
      const user = JSON.parse(userStr);

      const response = await httpRequest.delete(`/api/comments/${_id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      if (response.EC === 1) {
        toast.success(response.EM);
        onRatingChange && onRatingChange();
      } else {
        toast.error(response.EM || "Không thể xóa bình luận");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Không thể xóa bình luận");
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.comment_text);
    setEditRating(comment.rating);
  };

  const handleEditComment = async (commentId) => {
    try {
      if (!editCommentText.trim()) {
        toast.error("Nội dung bình luận không được để trống");
        return;
      }

      const response = await httpRequest.put(`/api/comments/${commentId}`, {
        comment_text: editCommentText,
        rating: editRating
      });

      if (response.EC === 1) {
        setComments(comments.map(comment =>
          comment._id === commentId ? response.comment : comment
        ));
        setEditingCommentId(null);
        setEditCommentText("");
        setEditRating(0);
        toast.success("Cập nhật bình luận thành công");
        onRatingChange && onRatingChange();
      } else {
        toast.error(response.EM);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Lỗi khi cập nhật bình luận");
    }
  };

  const RatingStats = () => (
    <div className="rating-stats">
      <div className="rating-summary">
        <div className="average-rating">
          <h3>{ratingStats.averageRating.toFixed(1)}</h3>
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className="star"
                color={index < Math.round(ratingStats.averageRating) ? "#ffc107" : "#e4e5e9"}
                size={20}
              />
            ))}
          </div>
          <p>{ratingStats.totalRatings} đánh giá</p>
        </div>
        <div className="rating-bars">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="rating-bar-row">
              <span>{star} sao</span>
              <div className="rating-bar">
                <div
                  className="rating-fill"
                  style={{
                    width: `${(ratingStats.ratingDetails[star] / ratingStats.totalRatings) * 100 || 0}%`
                  }}
                ></div>
              </div>
              <span>{ratingStats.ratingDetails[star]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Đang tải bình luận...</div>;

  return (
    <div className="comments-section">
      <RatingStats />

      <div className="write-comment">
        <div className="star-rating">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  style={{ display: 'none' }}
                />
                <FaStar
                  className="star"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  size={24}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>

        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận..."
          className="comment-input"
        />
        <button onClick={handleAddComment} className="btn btn-primary btn-send">
          Gửi
        </button>
      </div>

      <div className="list-comment">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-container">
            <div className="comment-main">
              <div className="comment-user">
                {comment.user_id.profile_picture && (
                  <img
                    src={`data:image/jpeg;base64,${comment.user_id.profile_picture}`}
                    alt="avatar"
                    className="user-avatar"
                  />
                )}
                <div className="user-content">
                  {comment.bill_id && (
                    <div className="booking-time">
                      Ngày đặt sân: {new Date(comment.bill_id.order_time).toLocaleString()}
                    </div>
                  )}
                  <div className="user-header">
                    <h5 className="name-user">{comment.user_id.name}</h5>
                    {editingCommentId === comment._id ? (
                      <div className="rating-edit">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className="star"
                            color={index < (editHover || editRating) ? "#ffc107" : "#e4e5e9"}
                            size={16}
                            onClick={() => setEditRating(index + 1)}
                            onMouseEnter={() => setEditHover(index + 1)}
                            onMouseLeave={() => setEditHover(0)}
                            style={{ cursor: 'pointer' }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rating-display">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className="star"
                            color={index < comment.rating ? "#ffc107" : "#e4e5e9"}
                            size={16}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {editingCommentId === comment._id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="edit-comment-input"
                      />
                      <div className="edit-actions">
                        <button
                          onClick={() => handleEditComment(comment._id)}
                          className="btn-save"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditCommentText("");
                            setEditRating(0);
                            setEditHover(0);
                          }}
                          className="btn-cancel"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="comment-desc">{comment.comment_text}</p>
                      <span className="date">{timeAgo(comment.createdAt)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {currentUserId && comment.user_id._id === currentUserId && !editingCommentId && (
              <div className="comment-actions">
                <button
                  onClick={() => handleStartEdit(comment)}
                  className="edit-btn"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="delete-btn"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comment;
