const cron = require("node-cron");
const Order = require("../models/Bill"); 
const moment = require("moment");

cron.schedule('* * * * *', async () => {
    try {
      const fifteenMinutesAgo = moment().subtract(15, 'minutes').valueOf();
  
      // Tìm các đơn hàng có trạng thái 'pending' và thời gian tạo trước 15 phút
      const orders = await Order.find({
        status: 'pending',
        apptime: { $lt: fifteenMinutesAgo }
      });
  
      // Cập nhật trạng thái của các đơn hàng này thành 'canceled'
      for (const order of orders) {
        order.status = 'canceled';
        await order.save();
        console.log(`Order ${order.apptransid} đã được cập nhật thành 'canceled'`);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    }
  });