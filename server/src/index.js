const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
const morgan = require("morgan");
const connectDB = require("./config/configDatabase");

const fieldRoutes = require("./routes/FieldRoutes")

const tournamentRoutes = require('./routes/TournamentRoutes')

const adminRoutes = require('./routes/AdminRoutes')

const ownerRoutes = require('./routes/OwnerRoutes')

const imageRoutes = require('./routes/ImgRoutes')

const authRoutes = require('./routes/AuthRoutes');

const fieldAvailabilityRoutes = require('./routes/FieldAvailabilityRoutes');


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

app.use('/api/img', imageRoutes);

app.use('/api/admin', adminRoutes)

app.use('/api/tournaments', tournamentRoutes)

app.use('/api/fieldAvailability', fieldAvailabilityRoutes);

app.use('/api/owner', ownerRoutes);


app.get("/", (req, res) => {
  res.send("Project");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//json web token
