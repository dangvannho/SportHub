const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
const morgan = require("morgan");
const connectDB = require("./config/configDatabase");

const tournamentRoutes = require("./routes/TournamentRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const fieldRoutes = require("./routes/FieldRoutes");

// config env
dotenv.config();
const port = process.env.POST || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("common"));
express.urlencoded({ extended: true });

// connect DB
connectDB();

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/", fieldRoutes);
app.use("/api/tournaments", tournamentRoutes);

app.get("/", (req, res) => {
  res.send("Project");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
