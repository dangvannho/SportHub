const mongoose = require("mongoose");
const dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
    })
    .then(() => {
      console.log("Kết nối thành công với MongoDB qua Mongoose!");
    })
    .catch((err) => {
      console.error("Lỗi kết nối:", err);
    });
};

module.exports = dbConnect;
