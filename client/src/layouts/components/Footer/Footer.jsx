import "./Footer.scss";

function Footer() {
  return (
    <>
      <div className="footer" id="footer">
        <div className="footer-content">
          <div className="row">
            <div className="col">
              <h5 className="footer-heading">GIỚI THIỆU</h5>
              <div className="footer-info">
                <p className="footer-desc">
                  Đặt sân SportHub cung cấp các tiện ích thông minh giúp cho bạn
                  tìm sân bãi và đặt sân một cách hiệu quả nhất.
                </p>

                <ul className="policy-group">
                  <li>Chính sách bảo mật</li>
                  <li>Chính sách huỷ (đổi trả)</li>
                  <li>Chính sách kiểm hàng</li>
                  <li>Chính sách thanh toán</li>
                </ul>
              </div>
            </div>

            <div className="col">
              <h5 className="footer-heading">THÔNG TIN</h5>
              <div className="footer-info">
                <ul className="contact-group">
                  <li>
                    <i className="fa-solid fa-building icon"></i>
                    Công ty cổ phần SportHub
                  </li>
                  <li>
                    <i className="fa-solid fa-barcode icon"></i>
                    <p className="m-0">MST:</p>
                    <span>123456789</span>
                  </li>
                  <li>
                    <i className="fa-regular fa-envelope icon"></i>
                    <p className="m-0">Mail:</p>
                    <span>contact@sporthub.com</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-location-dot icon"></i>
                    <p className="m-0">Địa chỉ:</p>
                    <span>Thành phố Đà Nẵng</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-phone icon"></i>
                    <p className="m-0">Điện thoại:</p>
                    <span>{"01234.567.8912"}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col">
              <h5 className="footer-heading">LIÊN HỆ</h5>
              <div className="care-customer">
                <div className="care-info">
                  <p>Chăm sóc khách hàng:</p>
                  <a href="tel:012345678912" className="number-phone">
                    012345678912
                  </a>
                  <a href="tel:012345678912" className="number-phone-button">
                    Gọi ngay
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-2">
        <div className="footer-content-2">
          <div className="row align-items-center ">
            <div className="col">
              <strong>&copy; SportHub 2024</strong>
            </div>
            <div className="col">
              <ul>
                <li>Điều khoản</li>
                <li>Chính sách</li>
                <li>Giới thiệu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
