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
  const embed_data = {
    redirecturl: "http://localhost:5173/",
  };
  const items = [];
  const transID = Math.floor(Math.random() * 1000000);

  const { _id } = req.body;
  if (!_id) {
    return res.status(400).json({
      EC: 0,
      EM: "Không tìm thấy dữ liệu",
    });
  }

  let availability;
  try {
    availability = await FieldAvailability.findById(_id);

    if (!availability) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy dữ liệu",
      });
    }

    if (!availability.is_available) {
      return res.status(400).json({
        EC: 0,
        EM: "Sân đã được đặt",
      });
    }
  } catch (error) {
    console.error("Error fetching field availability:", error);
    return res.status(500).json({
      EC: 0,
      EM: "Lỗi server",
    });
  }

  async function getFieldName() {
    try {
      const fieldInfo = await FieldAvailability.findById(
        availability._id
      ).populate({
        path: "field_id",
        select: "name",
      });

      // Truy cập name từ field_id
      if (fieldInfo && fieldInfo.field_id) {
        console.log("Field Name:", fieldInfo.field_id.name);
        return fieldInfo.field_id.name;
      } else {
        console.log("Field not found or not populated.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  let Field_name = await getFieldName();

  // format
  const availability_date = moment(availability.availability_date).format(
    "DD-MM-YYYY"
  );

  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: req.user.name,
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: availability.price,
    //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
    //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
    callback_url:
      "https://4531-2001-ee0-4b78-f00-8145-e4c-55c3-939e.ngrok-free.app/callback",
    description: `Thanh toán tiền cho sân: ${Field_name}, số tiền: ${availability.price}, từ ${availability.start_time} đến ${availability.end_time} vào ngày ${availability_date}`,
    bank_code: "",
  };
  console.log("Apptransid", order.app_trans_id);
  console.log("FieldAvailability: ", availability._id);
  console.log("test", Field_name);
  let name = req.user.name;
  let email = req.user.email;
  let id = req.user.id;
  console.log("user_name & user_email ", req.user.name, req.user.email);

  const orderData = {
    user_name: name,
    user_email: email,
    user_id: id,
    apptransid: order.app_trans_id,
    description: order.description,
    amount: availability.price,
    apptime: order.app_time,
    order_time: Date.now(),
    status: "pending",
  };

  const existingOrder = await Order.findOne({
    user_email: req.user.email,
    status: "pending",
    description: `Thanh toán tiền cho sân: ${Field_name}, số tiền: ${availability.price}, từ ${availability.start_time} đến ${availability.end_time} vào ngày ${availability_date}`,
  });

  if (existingOrder) {
    return res.status(400).json({
      EC: 0,
      EM: "Đơn hàng đã được tạo",
    });
  }

  try {
    const saveOrder = new Order(orderData);
    await saveOrder.save();
    console.log("Order saved ");
  } catch (error) {
    console.error("Error saving order:", error);
    return res.status(500).json({ message: "Error saving order" });
  }

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data =
    config.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.post("/callback", async (req, res) => {
  let result = {};
  console.log(req.body);

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    // Tính toán lại MAC để xác minh tính hợp lệ
    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // Kiểm tra callback có hợp lệ không
    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // Parse data từ ZaloPay
      let dataJson = JSON.parse(dataStr);

      const { app_trans_id } = dataJson; // Lấy mã giao dịch
      console.log(
        "Updating order's status = success where app_trans_id =",
        app_trans_id
      );

      // Transaction để cập nhật dữ liệu
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Tìm đơn hàng theo `app_trans_id`
        const order = await Order.findOne({ apptransid: app_trans_id }).session(
          session
        );

        if (!order) {
          throw new Error("Order not found");
        }

        // Cập nhật trạng thái đơn hàng
        order.status = "complete";
        await order.save({ session });

        // Cập nhật trạng thái sân
        const fieldAvailability = await FieldAvailability.findOne({
          _id: order._id,
        }).session(session);

        if (fieldAvailability) {
          fieldAvailability.is_available = false;
          await fieldAvailability.save({ session });
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        console.log("Order and field updated successfully");
        result.return_code = 1;
        result.return_message = "success";
      } catch (error) {
        // Rollback nếu lỗi xảy ra
        await session.abortTransaction();
        session.endSession();

        console.error("Transaction failed:", error.message);
        result.return_code = 0; // ZaloPay sẽ callback lại tối đa 3 lần
        result.return_message = error.message;
      }
    }
  } catch (ex) {
    console.error("Error:", ex.message);
    result.return_code = 0;
    result.return_message = ex.message;
  }

  // Phản hồi cho ZaloPay server
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
