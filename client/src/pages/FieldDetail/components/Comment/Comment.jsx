import { useEffect, useState } from "react";
import { io } from "socket.io-client";
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

function Comment({ fieldId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

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

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    socket.emit("newComment", {
      field_id: fieldId,
      comment_text: newComment,
      user_id: userId,
    });

    setNewComment("");
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
      } else {
        toast.error(response.EM || "Không thể xóa bình luận");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Không thể xóa bình luận");
    }
  };

  const handleEditComment = async (_id) => {
    try {
      const response = await httpRequest.put(`/api/comments/${_id}`, {
        comment_text: editCommentText,
      });

      if (response.EC === 1) {
        toast.success(response.EM);
        setEditingCommentId(null);
        setEditCommentText("");
      } else {
        toast.error(response.EM || "Không thể sửa bình luận");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("Không thể sửa bình luận");
    }
  };

  if (loading) return <div>Đang tải bình luận...</div>;

  return (
    <div className="comments-section">
      <div className="write-comment">
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
            <div className="comment-header">
              <div className="user-info">
                {comment.user_id.profile_picture && (
                  <img
                    src={`data:image/jpeg;base64,${comment.user_id.profile_picture}`}
                    alt="avatar"
                    className="user-avatar"
                  />
                )}
                <h5 className="name-user">{comment.user_id.name}</h5>
              </div>
              {currentUserId && comment.user_id._id === currentUserId && (
                <div className="comment-actions">
                  {editingCommentId === comment._id ? (
                    <>
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        className="save-btn"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditCommentText("");
                        }}
                        className="cancel-btn"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditCommentText(comment.comment_text);
                        }}
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
                    </>
                  )}
                </div>
              )}
            </div>
            {editingCommentId === comment._id ? (
              <input
                type="text"
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
                className="edit-comment-input"
              />
            ) : (
              <p className="comment-desc">{comment.comment_text}</p>
            )}
            <span className="date">{timeAgo(comment.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comment;
