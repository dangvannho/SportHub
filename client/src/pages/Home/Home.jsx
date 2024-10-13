import { useState, useEffect } from "react";
import StarIcon from "~/components/StarIcon/StarIcon";
import featureImage1 from "~/assets/img/feature-1.png";
import featureImage2 from "~/assets/img/feature-2.png";
import "./Home.scss";

function Home() {
  const [loadImg, setLoadImg] = useState(false);

  useEffect(() => {
    setLoadImg(true);
  }, []);
  return (
    <div className="home-wrapper">
      <div className={`hero ${loadImg ? "load" : ""}`}>
        <div className="hero-desc">
          <StarIcon />
          <h2 className="title">Hệ thống hỗ trợ tìm kiếm sân bãi nhanh</h2>
          <span className="line"></span>
          <p className="desc">
            Dữ liệu được SportHub cập nhật thường xuyên giúp cho người dùng tìm
            được sân một cách nhanh nhất
          </p>

          <div className="search-container">
            <div className="row g-0 form-group">
              <div className="col">
                <select className="form-select">
                  <option selected>Bóng đá</option>
                  <option value="1">Tennis</option>
                  <option value="2">Gold</option>
                  <option value="3">Cầu lông</option>
                  <option value="4">Bóng bàn</option>
                </select>
              </div>

              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên sân"
                />
              </div>

              <div className="col">
                <input
                  type="type"
                  className="form-control"
                  placeholder="Nhập khu vực"
                />
              </div>
            </div>
            <div className="btn btn-warning btn-search">
              <span>Tìm kiếm</span>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="feature-group">
        <div className="feature-item">
          <img src={featureImage1} alt="" />
          <h4 className="feature-item__tilte">Tìm kiếm vị trí sân</h4>
          <p className="feature-item__desc">
            Dữ liệu sân đấu dồi dào, liên tục cập nhật, giúp bạn dễ dàng tìm
            kiếm theo khu vực mong muốn
          </p>
        </div>

        <span className="separate"></span>

        <div className="feature-item">
          <img src={featureImage2} alt="" style={{ marginBottom: 12 }} />
          <h4 className="feature-item__tilte">Đặt lịch online</h4>
          <p className="feature-item__desc">
            Không cần đến trực tiếp, không cần gọi điện đặt lịch, bạn hoàn toàn
            có thể đặt sân ở bất kì đâu có internet
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
