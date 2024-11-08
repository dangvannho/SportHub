const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const { v1: uuidv1 } = require('uuid');
const moment = require('moment');
const qs = require('qs');

// APP INFO
const config = {
  appid: "554",
  key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
  key2: "uUfsWgfLkRLzq6W2uNXTCxrfxs51auny",
  endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
};


const payment = async (req, res) => {
  const embeddata = {
    redirecturl: "https://www.facebook.com"
  };

  const items = [{
    itemid: "knb",
    itemname: "kim nguyen bao",
    itemprice: 198400,
    itemquantity: 1
  }];

  const order = {
    appid: config.appid,
    apptransid: `${moment().format('YYMMDD')}_${uuidv1()}`, // mã giao dich có định dạng yyMMdd_xxxx
    appuser: "demo",
    apptime: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embeddata: JSON.stringify(embeddata),
    amount: 100000,
    description: "ZaloPay Integration Demo",
    bankcode: "",
    callback_url: " https://6ba3-171-225-184-80.ngrok-free.app/api/payment/callback",
  };


  console.log("apptransid:", order.apptransid); // In ra giá trị của apptransid
  // appid|apptransid|appuser|amount|apptime|embeddata|item
  const data = config.appid + "|" + order.apptransid + "|" + order.appuser + "|" + order.amount + "|" + order.apptime + "|" + order.embeddata + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

 
   try {
    const result = await axios.post(config.endpoint, null, { params: order }) 
    res.status(200).json(result.data);
    console.log(result.data);
   } catch (error) {
     console.log(error.message);
     res.status(500).json({ message: "Payment failed", error: error.message });
    
   }
};



const callback = async  (req, res) =>  {
  console.log("Received callback from ZaloPay", req.body);

  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.returncode = -1;
      result.returnmessage = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log("update order's status = success where apptransid =", dataJson["apptransid"]);

      result.returncode = 1;
      result.returnmessage = "success";
    }
  } catch (ex) {
    result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.returnmessage = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
}

const  checkStatus = async (req, res) => {
  const apptransid = req.params.apptransid;
  let postData = {
    appid: config.appid,
    apptransid: apptransid, // Input your apptransid
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
    res.status(200).json(result.data);
    console.log(result.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Check status failed", error: error.message });
  }
}

module.exports = {
  payment,
  callback,
  checkStatus
};