const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
const morgan = require("morgan");
const cron = require("node-cron");
const connectDB = require("./config/configDatabase");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Comment = require('./models/Comment');
const socketIO = require('./socket');

const fieldRoutes = require("./routes/FieldRoutes");

const tournamentRoutes = require("./routes/TournamentRoutes");

const adminRoutes = require("./routes/AdminRoutes");

const ownerRoutes = require("./routes/OwnerRoutes");

const imageRoutes = require("./routes/ImgRoutes");

const authRoutes = require("./routes/AuthRoutes");

const commentRoutes = require('./routes/CommentRoutes');

const fieldAvailabilityRoutes = require("./routes/FieldAvailabilityRoutes");

// config env
dotenv.config();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("common"));

// connect DB
connectDB();
// import models

// Routes

app.use("/api/fields", fieldRoutes);

app.use("/api/img", imageRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/tournaments", tournamentRoutes);

app.use("/api/owner", ownerRoutes);

app.use("/api/field_availability", fieldAvailabilityRoutes);

app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => {
  res.send("Project");
});

app.use("/api/auth", authRoutes);

const httpServer = createServer(app);
const io = socketIO.init(httpServer);

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
