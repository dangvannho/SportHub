import "./Header.scss";

function Header() {
  return (
    <div className="header">
      <div className="header-content">
        <img src="" alt="" className="header-logo" />

        <nav className="header-nav">
          <li>Trang chủ</li>
          <li>Danh sách sân bãi</li>
          <li>Giới thiệu</li>
          <li>Chính sách</li>
          <li>Điều khoản</li>
          <li>Dành cho chủ sân</li>
          <li>Liên hệ</li>
        </nav>

        <div className="group-btn">
          <button className="btn btn-dark">Đăng nhập</button>
          <button className="btn btn-light">Đăng kí</button>
        </div>
      </div>
    </div>
  );
}

export default Header;
