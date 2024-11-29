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
const Comment = require("./models/Comment");
const socketIO = require("./socket");
const bodyParser = require("body-parser");

const config = require("../configzlp.json");
const CryptoJS = require("crypto-js");

const axios = require("axios").default;
const moment = require("moment"); // npm install moment
const qs = require("qs");

const fieldRoutes = require("./routes/FieldRoutes");

const tournamentRoutes = require("./routes/TournamentRoutes");

const adminRoutes = require("./routes/AdminRoutes");

const ownerRoutes = require("./routes/OwnerRoutes");

const imageRoutes = require("./routes/ImgRoutes");

const authRoutes = require("./routes/AuthRoutes");

const paymentRoutes = require("./routes/PaymentRoutes");

const commentRoutes = require("./routes/CommentRoutes");

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

// app.use('/api/payment', paymentRoutes);
require("./utils/setPaymentStatus");
app.use("/api/comments", commentRoutes);

app.use(bodyParser.json());

app.use("/api/field_availability", fieldAvailabilityRoutes);

app.get("/", (req, res) => {
  res.send("Project");
});

app.use("/api/auth", authRoutes);

const httpServer = createServer(app);
const io = socketIO.init(httpServer);

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
//json web token

//////////////////////PAYMENT////////////////////////////////////////////////////////////////////////////

const FieldAvailability = require("../../server/src/models/Field_Availability");
const Field = require("../../server/src/models/Field");
const Order = require("../../server/src/models/Order");
const middlewareController = require("../../server/src/controllers/middlewareControler");
const mongoose = require("mongoose");

app.post("/payment", middlewareController.verifyToken, async (req, res) => {
  const items = [];
  const transID = Math.floor(Math.random() * 1000000);
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ EC: 0, EM: "Không tìm thấy dữ liệu" });
  }

  let availability;
  try {
    availability = await FieldAvailability.findById(_id).lean();
    if (!availability) {
      return res.status(404).json({ EC: 0, EM: "Không tìm thấy dữ liệu" });
    }

    if (!availability.is_available) {
      return res.status(400).json({ EC: 0, EM: "Sân đã được đặt" });
    }
  } catch (error) {
    console.error("Error fetching field availability:", error);
    return res.status(500).json({ EC: 0, EM: "Lỗi server" });
  }

  id = availability.field_id;
  console.log("Field ID:", id);

  const embed_data = {
    redirecturl: `http://localhost:5173/booking/${id}`,
    field_id: req.body._id, // Thêm _id vào embed_data
  };

  const availability_date = moment(availability.availability_date).format(
    "DD-MM-YYYY"
  );
  const Field_name =
    (
      await FieldAvailability.findById(_id)
        .populate({ path: "field_id", select: "name" })
        .lean()
    )?.field_id?.name || "Không xác định";

  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: req.user.name,
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data), // Gửi embed_data chứa _id
    amount: availability.price,
    callback_url: "https://c5f5-171-225-184-192.ngrok-free.app/callback",
    description: `Thanh toán tiền cho sân: ${Field_name}, số tiền: ${availability.price}, từ ${availability.start_time} đến ${availability.end_time} vào ngày ${availability_date}`,
    bank_code: "",
  };

  // const existingOrder = await Order.findOne({
  //   user_email: req.user.email,
  //   status: "pending",
  //   description: order.description,
  // });

  // if (existingOrder) {
  //   return res.status(400).json({ EC: 0, EM: "Đơn hàng đã được tạo" });
  // }

  try {
    const saveOrder = new Order({
      user_name: req.user.name,
      user_email: req.user.email,
      user_id: req.user.id,
      apptransid: order.app_trans_id,
      description: order.description,
      amount: availability.price,
      apptime: order.app_time,
      order_time: Date.now(),
      status: "pending",
    });
    await saveOrder.save();
    console.log("Order saved");
  } catch (error) {
    console.error("Error saving order:", error);
    return res.status(500).json({ message: "Error saving order" });
  }

  const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.error("Error sending payment request:", error.message);
    return res.status(400).json({ message: error.message });
  }
});

app.post("/callback", async (req, res) => {
  let result = {};
  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    if (reqMac !== mac) {
      result = { return_code: -1, return_message: "mac not equal" };
    } else {
      const dataJson = JSON.parse(dataStr);
      const { app_trans_id, embed_data } = dataJson;

      // Trích xuất field_id từ embed_data
      const { field_id } = JSON.parse(embed_data);
      console.log("Field ID from embed_data:", field_id);

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const order = await Order.findOne({ apptransid: app_trans_id }).session(
          session
        );
        if (!order) throw new Error("Order not found");

        order.status = "complete";
        await order.save({ session });

        const fieldAvailability = await FieldAvailability.findById(
          field_id
        ).session(session);
        if (!fieldAvailability) throw new Error("FieldAvailability not found");

        fieldAvailability.is_available = false;
        await fieldAvailability.save({ session });

        await session.commitTransaction();
        result = { return_code: 1, return_message: "success" };
      } catch (error) {
        await session.abortTransaction();
        console.error("Transaction failed:", error.message);
        result = { return_code: 0, return_message: error.message };
      } finally {
        session.endSession();
      }
    }
  } catch (error) {
    console.error("Callback processing error:", error.message);
    result = { return_code: 0, return_message: error.message };
  }

  res.json(result);
});

app.post("/check", async (req, res) => {
  const { apptransid, _id } = req.body;

  let postData = {
    appid: config.app_id,
    apptransid: apptransid, // Sử dụng apptransid từ yêu cầu POST
  };

  let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: config.check,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log("lỗi");
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
