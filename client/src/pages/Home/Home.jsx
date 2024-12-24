import { useState, useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "~/context/AppContext";
import routeConfig from "~/config/routeConfig";
import getAllField from "~/services/Field/getAllField";
import StarIcon from "~/components/StarIcon/StarIcon";
import featureImage1 from "~/assets/img/feature-1.png";
import featureImage2 from "~/assets/img/feature-2.png";
import "./Home.scss";

function Home() {
  const [loadImg, setLoadImg] = useState(false);
  const [selectedTypeField, setSelectedTypeField] = useState("all");
  const [fieldName, setFieldName] = useState("");
  const [fieldAddress, setFieldAddress] = useState("");
  const [listTypeField, setListTypeField] = useState([]);

  const { setSearchCriteria } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoadImg(true);
    fetchAllTypeField();
    resetSearch();
  }, []);

  const fetchAllTypeField = async () => {
    const data = await getAllField(1, 9);
    setListTypeField(data.totalFieldsByType);
  };

  const resetSearch = () => {
    setSearchCriteria({
      typeField: "all",
      fieldName: "",
      fieldAddress: "",
    });
  };

  const handleSearch = () => {
    setSearchCriteria({
      typeField: selectedTypeField,
      fieldName,
      fieldAddress,
    });

    navigate(routeConfig.sportFields);
  };

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
                <select
                  className="form-select"
                  value={selectedTypeField}
                  onChange={(e) => setSelectedTypeField(e.target.value)}
                >
                  <option value="all">Tất cả các sân</option>
                  {listTypeField.map((item, index) => {
                    return <option key={index}>{item._id}</option>;
                  })}
                </select>
              </div>

              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên sân"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                />
              </div>

              <div className="col">
                <input
                  type="type"
                  className="form-control"
                  placeholder="Nhập khu vực"
                  value={fieldAddress}
                  onChange={(e) => setFieldAddress(e.target.value)}
                />
              </div>
            </div>
            <div className="btn btn-warning btn-search" onClick={handleSearch}>
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
