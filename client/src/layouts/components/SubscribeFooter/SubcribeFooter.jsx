import "./SubcribeFooter.scss";
import imgPlayer from "~/assets/img/player.png";

function SubcribeFooter() {
  return (
    <div className="footer-subcribe">
      <div className="subcribe-desc">
        <h4>
          Bạn muốn đăng ký sử dụng phần mềm quản lý sân SportHub MIỄN PHÍ ?
        </h4>
      </div>

      <img src={imgPlayer} alt="" className="img-player" />

      <div className="subcribe-form">
        <input type="text" placeholder="Họ & tên*" />
        <input type="text" placeholder="Số điện thoại*" />
        <input type="email" placeholder="Email" />
        <button className="btn-send">GỬI</button>
      </div>
    </div>
  );
}

export default SubcribeFooter;
