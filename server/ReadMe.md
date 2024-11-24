1.npm i 
2.Tải ngrok : https://download.ngrok.com/windows 
3.Sau đó gõ : ngrok http 8081
4.Lấy cái link vừa được tạo , 
ở phần "Forwarding  https://b1f7-171-225-185-56.ngrok-free.app -> http://localhost:8081"
5.Lấy cái link vừa tạo được dán vào phần controller/payment ở hàm payment
Dòng 65
"const order = {
    appid: config.appid, 
    apptransid: `${moment().format('YYMMDD')}_${uuid()}`, // mã giao dich có định dạng yyMMdd_xxxx
    appuser: "demo", 
    apptime: Date.now(), // miliseconds
    item: JSON.stringify(items), 
    embeddata: JSON.stringify(embeddata), 
    amount: availability.price, 
    callback_url: "https://53a6-117-2-155-20.ngrok-free.app/callback",`<<<-Bỏ cái link ngrok mới tạo`
    description: `Thanh toán tiền cho sân: ${field_id}, số tiền: ${availability.price}, từ ${start_time} đến ${end_time} vào lúc ${availability_date}`, // Updated description
    bankcode: "", 
  };"
Sau đó cầu nguyện là cho nó thanh toán được chứ cái callback bị ngu
Chúc may mắn :DDDD
