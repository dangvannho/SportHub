const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
const morgan = require("morgan");
const cron = require("node-cron");
const connectDB = require("./config/configDatabase");
const bodyParser = require('body-parser');
const config = require("../configzlp.json")
const CryptoJS = require('crypto-js');

const fieldRoutes = require("./routes/FieldRoutes");

const tournamentRoutes = require("./routes/TournamentRoutes");

const adminRoutes = require("./routes/AdminRoutes");

const ownerRoutes = require("./routes/OwnerRoutes");

const imageRoutes = require("./routes/ImgRoutes");

const authRoutes = require('./routes/AuthRoutes');

const paymentRoutes = require('./routes/PaymentRoutes');

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

app.use('/api/owner', ownerRoutes);

app.use('/api/payment', paymentRoutes);
require("./utils/setPaymentStatus")


app.use(bodyParser.json());

app.post('/callback', (req, res) => {
  let result = {};
  console.log(req.body);
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log('mac =', mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = 'mac not equal';
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng ở đây
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson['app_trans_id'],
      );

      result.return_code = 1;
      result.return_message = 'success';
    }
  } catch (ex) {
    console.log('lỗi:::' + ex.message);
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }
  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

app.use("/api/field_availability", fieldAvailabilityRoutes);

app.get("/", (req, res) => {
  res.send("Project");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//json web token






