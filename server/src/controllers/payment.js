// const axios = require('axios').default;
// const CryptoJS = require('crypto-js');
// const { v1: uuid } = require('uuid');
// const moment = require('moment');
// const qs = require('qs');
// const bodyParser = require('body-parser');

// const FieldAvailability = require('../models/Field_Availability');
// const Field = require('../models/Field');
// const Order = require('../models/Order');
// const config = require('../../configzlp.json');
// // APP INFO

// const payment = async (req, res) => {
//   const embeddata = {
//     redirecturl: "https://mydtu.duytan.edu.vn/Signin.aspx", // sửa lại thành cái route mà mình muốn
//   };
  
//   const items = [{
//     itemid: "sdb",
//     itemname: "san da bong",
//     itemprice: 1,
//     itemquantity: 1
//   }];

//   const { _id } = req.body;
//   if (!_id) {
//     return res.status(400).json({
//       EC: 0,
//       EM: "Không tìm thấy dữ liệu"
//     });
//   }

//   let availability;
//   try {
//     availability = await FieldAvailability.findById(_id);

//     if (!availability) {
//       return res.status(404).json({
//         EC: 0,
//         EM: "Không tìm thấy dữ liệu"
//       });
//     }

//     if (!availability.is_available) {
//       return res.status(400).json({
//         EC: 0,
//         EM: "Sân đã được đặt"
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching field availability:", error);
//     return res.status(500).json({
//       EC: 0,
//       EM: "Lỗi server"
//     });
//   }

//   // const existingOrder = await Order.findOne({
   
//   //   user_email: req.user.email,
//   //   status: 'pending',
//   //   description: `Thanh toán tiền cho sân: ${availability.field_id}, số tiền: ${availability.price}, từ ${availability.start_time} đến ${availability.end_time} vào ngày ${moment(availability.availability_date).format('DD-MM-YYYY')}`
//   // });

//   // if (existingOrder) {
//   //   return res.status(400).json({
//   //     EC: 0,
//   //     EM: "Đơn hàng đã được tạo"
//   //   });
//   // }


//   async function getFieldName() {
//     try {
//       const fieldInfo = await FieldAvailability.findById(availability._id)
//         .populate({
//           path: 'field_id',
//           select: 'name'
//         });
  
//       // Truy cập name từ field_id
//       if (fieldInfo && fieldInfo.field_id) {
//         console.log('Field Name:', fieldInfo.field_id.name);
//         return fieldInfo.field_id.name;
//       } else {
//         console.log('Field not found or not populated.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }
  
//   let Field_name  = await getFieldName();  
  





//   // format
//   const availability_date = moment(availability.availability_date).format('DD-MM-YYYY');

//   const order = {
//     appid: config.appid,
//     apptransid: `${moment().format('YYMMDD')}_${uuid()}`, // mã giao dich có định dạng yyMMdd_xxxx
//     appuser: req.user.name, 
//     apptime: Date.now(), // miliseconds
//     item: JSON.stringify(items),
//     embeddata: JSON.stringify(embeddata),
//     amount: availability.price,
//     callback_url: "https://41da-171-225-184-200.ngrok-free.app/api/payment/callback", // Thêm cái link tạo ở ngrok ở đây
//     description: `Thanh toán tiền cho sân: ${Field_name}, số tiền: ${availability.price}, từ ${availability.start_time} đến ${availability.end_time} vào ngày ${availability_date}`, // Updated description
//     bankcode: "",
//   };
//   console.log("Apptransid: ", order.apptransid);
//   console.log("FieldAvailability: ", availability._id);
//   console.log("test", Field_name);
//   let name = req.user.name;
//   let email = req.user.email;
//   let id = req.user.id;
//   console.log("user_name & user_email ", req.user.name , req.user.email);
 
  
//   const orderData = {
//     user_name: name ,
//     user_email: email, 
//     user_id: id,
//     apptransid: order.apptransid,
//     description: order.description,
//     amount: availability.price,
//     apptime: order.apptime,
//     order_time: Date.now(),
//     status: 'pending',
   
//   };

//   try {
//     const saveOrder = new Order(orderData);
//     await saveOrder.save();
//     console.log('Order saved ');
//   } catch (error) {
//     console.error('Error saving order:', error);
//     return res.status(500).json({ message: 'Error saving order' });
//   }

//   // appid|apptransid|appuser|amount|apptime|embeddata|item
//   const data = config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
//   order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

//   try {
//     const result = await axios.post(config.endpoint, null, { params: order });
//     console.log(result.data);
//     return res.status(200).json(result.data);
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };


// const callback = async (req, res) => { 
//     let result = {};
//   console.log(req.body);
//   try {
//     let dataStr = req.body.data;
//     let reqMac = req.body.mac;

//     let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
//     console.log('mac =', mac);

//     // kiểm tra callback hợp lệ (đến từ ZaloPay server)
//     if (reqMac !== mac) {
//       // callback không hợp lệ
//       result.return_code = -1;
//       result.return_message = 'mac not equal';
//     } else {
//       // thanh toán thành công
//       // merchant cập nhật trạng thái cho đơn hàng ở đây
//       let dataJson = JSON.parse(dataStr, config.key2);
//       console.log(
//         "update order's status = success where app_trans_id =",
//         dataJson['app_trans_id'],
//       );

//       result.return_code = 1;
//       result.return_message = 'success';
//     }
//   } catch (ex) {
//     console.log('lỗi:::' + ex.message);
//     result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
//     result.return_message = ex.message;
//   }

//   // thông báo kết quả cho ZaloPay server
//   res.json(result);
//  }


// const checkStatus = async (req, res) => { 
//   const { apptransid , _id } = req.body;

//   let postData = {
//     appid: config.appid,
//     apptransid: apptransid, 
//     // field_id : field_id,
//     // start_time : start_time,
//     // end_time : end_time,
//     _id : _id
//   };

//   let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
//   postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

//   let postConfig = {
//     method: 'post',
//     url: config.check,
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     data: qs.stringify(postData)
//   };

//   try {
//     const result = await axios(postConfig);
//     const { returncode, returnmessage } = result.data; 
   
//     if (returncode === 1 && returnmessage === "Giao dịch thành công") {
//       // Tìm kiếm và cập nhật `is_available` của `FieldAvailability`
//       const field = await FieldAvailability.findOneAndUpdate(
//         { _id: _id },
//         { is_available: false } // Cập nhật giá trị is_available
//       );

//       if (field) {
//         console.log("Sân đã được đặt thành công.");

//         // Cập nhật trạng thái của đơn hàng
//         await Order.findOneAndUpdate(
//           { apptransid: apptransid }, 
//           { status: 'complete' }      
//         );

//         console.log("Giao dịch thành công. Sân đã được đặt và trạng thái đơn hàng đã được cập nhật.");
//       } else {
//         console.log("Không tìm thấy bản ghi phù hợp trong FieldAvailability.");
//       }
//     } else {
//       console.log("Giao dịch không thành công. Thông báo:", returnmessage);
//     }

//     return res.status(200).json(result.data);
//   } catch (error) {
//     console.log("Lỗi:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };



// module.exports = {
//   payment,
//   callback,
//   checkStatus,
 
// };
