const cron = require("node-cron");
const Order = require("../models/Bill"); 
const moment = require("moment");
const FieldAvailability = require('../models/Field_Availability');


cron.schedule('* * * * *', async () => {
  try {
    const fifteenMinutesAgo = moment().subtract(2, 'minutes').valueOf();

    // Tìm các đơn hàng có trạng thái 'pending' và thời gian tạo trước 15 phút
    const orders = await Order.find({
      status: 'pending',
      order_time: { $lt: fifteenMinutesAgo }
    });
    // Cập nhật trạng thái của các đơn hàng này thành 'canceled'
    for (const order of orders) {
      order.status = 'canceled';
      await order.save();
      console.log(`Order ${order.apptransid} đã được cập nhật thành 'canceled'`);

      // Mở khóa sân tương ứng
      const fieldAvailability = await FieldAvailability.findById(order.field_availability_id);
      if (fieldAvailability) {
        fieldAvailability.is_available = true; // Đặt lại trạng thái sân
        fieldAvailability.lock_time = null; // Đặt lock_time về null
        await fieldAvailability.save(); // Lưu thay đổi
        console.log(`Sân ${fieldAvailability._id} đã được mở khóa.`);
      } else {
        console.log(`Không tìm thấy sân cho order ${order.apptransid}.`);
      }
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
  }
});
//unlock field


