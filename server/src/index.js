const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
const morgan = require("morgan");

// config env
dotenv.config();
const port = process.env.POST || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("common"));

// connect DB

// Routes

app.get("/", (req, res) => {
  res.send("Project");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
