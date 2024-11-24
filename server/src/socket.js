let io = null;

const Comment = require('./models/Comment');

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST", "DELETE", "PUT"],
                credentials: true
            }
        });

        io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);

            socket.on("joinRoom", (fieldId) => {
                socket.join(`field_${fieldId}`);
                console.log(`Socket ${socket.id} joined room: field_${fieldId}`);
            });

            socket.on("newComment", async (data) => {
                try {
                    const { field_id, comment_text, user_id } = data;
                    const newComment = new Comment({
                        user_id,
                        field_id,
                        comment_text
                    });
                    await newComment.save();
                    const populatedComment = await Comment.findById(newComment._id)
                        .populate('user_id', 'name profile_picture');
                    populatedComment._doc.isOwner = true;
                    io.to(`field_${field_id}`).emit("receiveComment", populatedComment);
                } catch (error) {
                    console.error("Error handling new comment:", error);
                    socket.emit("commentError", "Không thể thêm bình luận");
                }
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            return null;
        }
        return io;
    }
}; 