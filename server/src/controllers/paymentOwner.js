const mongoose = require("mongoose");
const Bill = require("../models/Bill");
const PayOS = require("../utils/payos");
const Owner = require("../models/Owner");

const payment = async (req, res) => {
  const session = await mongoose.startSession();
  const YOUR_DOMAIN = 'http://localhost:8081';
  let transactionCommitted = false;

  try {
    session.startTransaction();

    const orderCode = Number(String(Date.now()).slice(-6)); // Tạo mã orderCode duy nhất
    const description = `Thanh toan dang ky san`;
    const body = {
      orderCode: orderCode,
      amount: 2000,
      description: description,
      returnUrl: `${YOUR_DOMAIN}/successOwner.html`,
      cancelUrl: `${YOUR_DOMAIN}/cancelOwner.html`
    };

    const saveOrder = new Bill({
      user_id: req.user.id,
      user_name: req.user.name,
      user_email: req.user.email,
      apptransid: orderCode, // Đồng bộ orderCode với apptransid
      description: description,
      amount: 2000,
      order_time: Date.now(),
      status: 'pending'
    });
    await saveOrder.save({ session });
    await session.commitTransaction();
    transactionCommitted = true;

    const paymentLinkResponse = await PayOS.createPaymentLink(body);
    const paymentlink = paymentLinkResponse.checkoutUrl;
    console.log("Payment link created:", paymentlink);
    return res.status(200).json({ paymentlink });
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
    }
    console.error("Transaction failed:", error.message);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};


const callback = async (req, res) => {
  console.log(req.body);
  console.log('Receive hook');

  const { data } = req.body;
  if (!data || !data.orderCode) {
    return res.status(400).json({ message: 'Mã giao dịch không được cung cấp' });
  }

  console.log("Status:", data.desc);
  console.log("Order code:", data.orderCode);
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Bill.findOne({ apptransid: data.orderCode }).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Không tìm thấy đơn hàng với mã giao dịch: " + data.orderCode });
    }

    if (order.status === 'complete') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Đơn hàng đã được hoàn tất trước đó.' });
    }

    if (String(data.desc).toLowerCase() === 'success') {
      order.status = "complete";
    } else {
      order.status = "failed";
    }
    await order.save({ session });
    console.log("Order status updated to:", order.status);

    await session.commitTransaction();
    console.log("Transaction committed successfully.");

    const updatedOrder = await Bill.findById(order._id);
    console.log("Updated order status after commit:", updatedOrder.status);

    res.status(200).json({
      return_code: 1,
      return_message: "success",
      order: updatedOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction failed:", error.message);
    res.status(400).json({
      return_code: 0,
      return_message: 'Xử lý không thành công. Chi tiết: ' + error.message,
    });
  } finally {
    session.endSession();
  }
};


module.exports = {
  payment,
  callback
};