const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const { v1: uuid } = require('uuid');
const moment = require('moment');
const qs = require('qs');

const mongoose = require('mongoose');
const FieldAvailability = require('../models/Field_Availability');
const Order = require('../models/Order');
const config = require('../../configzlp.json');
// APP INFO

const payment = async (req, res) => {
  const embeddata = {
    redirecturl: "https://www.facebook.com",
  };

  const items = [{
    itemid: "sdb",
    itemname: "kim nguyen bao",
    itemprice: 198400,
    itemquantity: 1
  }];
  
  
  const order = {
    appid: config.appid, 
    apptransid: `${moment().format('YYMMDD')}_${uuid()}`, // mã giao dich có định dạng yyMMdd_xxxx
    appuser: "demo", 
    apptime: Date.now(), // miliseconds
    item: JSON.stringify(items), 
    embeddata: JSON.stringify(embeddata), 
    amount: 50000, 
    callback_url: "https://53a6-117-2-155-20.ngrok-free.app/callback",
    description: "ZaloPay Integration Demo",
    bankcode: "", 
    
  };
  console.log("Apptransid: ", order.apptransid);  

   const saveOrder = new Order({
    apptransid: order.apptransid,
    description: order.description,
    amount: order.amount,
    apptime: order.apptime, 
  });

  try {
    await saveOrder.save();
    console.log('Order saved ');
  } catch (error) {
    console.error('Error saving order:', error);
    return res.status(500).json({ message: 'Error saving order' });
  }
  // appid|apptransid|appuser|amount|apptime|embeddata|item
  const data = config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
  try {
    const result = await axios.post(config.endpoint, null, { params: order });
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const checkStatus = async (req, res) => { 
  const { apptransid } = req.body;

  let postData = {
    appid: config.appid,
    apptransid: apptransid, // Sử dụng apptransid từ yêu cầu POST
  };

  let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: 'post',
    url: "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(postData)
  };

  try {
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log('lỗi');
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

} 


module.exports = {
  payment,
 // callback,
  checkStatus
};

