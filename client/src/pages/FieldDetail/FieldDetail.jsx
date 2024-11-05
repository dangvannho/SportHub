import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineStar } from "react-icons/md";
import { IoMdCalendar } from "react-icons/io";
import getFieldDetail from "~/services/Field/getFieldDetail";

import Comment from "./components/Comment/Comment";
import routeConfig from "~/config/routeConfig";
import "./FieldDetail.scss";

function FieldDetail() {
  const { id } = useParams();
  const [fieldDetail, setFieldDetail] = useState({});
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchFieldDetail();
  }, []);

  const fetchFieldDetail = async () => {
    const data = await getFieldDetail(id);
    setFieldDetail(data);
    setImages(data.images);
    setCurrentImage(data.images[0]);
  };

  return (
    <div className="field-detail-wrapper">
      <div className="heading">
        <h5 className="heading-name">{fieldDetail.name}</h5>

        <ul className="heading-desc">
          <li className="star">
            4.6
            <MdOutlineStar color="#f9b90f" />
          </li>
          <li className="item-desc">100 Đánh giá</li>
          <li className="item-desc">{fieldDetail?.owner_id?.business_name}</li>
          <li className="item-desc">{fieldDetail.location}</li>
        </ul>
      </div>

      <div className="detail-content">
        <div className="field-image">
          <img src={`data:image/jpeg;base64,${currentImage}`} alt="" />
        </div>

        <div className="owner-info">
          <h3 className="owner-info__heading">Thông tin chủ sân</h3>
          <div className="owner-info__content">
            <div className="owner owner-name">
              <i className="fa-solid fa-user"></i>
              <span>{fieldDetail?.owner_id?.business_name}</span>
            </div>

            <div className="owner owner-sdt">
              <i className="fa-solid fa-phone"></i>
              <span>{fieldDetail?.owner_id?.phone_number}</span>
            </div>

            <div className="owner owner-email">
              <i className="fa-solid fa-envelope"></i>
              <span>{fieldDetail?.owner_id?.email}</span>
            </div>

            <div className="owner owner-address">
              <i className="fa-solid fa-location-dot"></i>
              <span>{fieldDetail.location}</span>
            </div>

            <div className="map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15335.126312067925!2d108.22454270436094!3d16.07682035263101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421826e29ff787%3A0x7e19b45aeff65fe7!2zQW4gSOG6o2ksIEFuIEjhuqNpIELhuq9jLCBTxqFuIFRyw6AsIMSQw6AgTuG6tW5nLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2sus!4v1730617186549!5m2!1svi!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </div>
          </div>
        </div>

        <div className="silde-image">
          {images.map((image, index) => {
            return (
              <div
                className="thumbnail"
                key={index}
                onClick={() => setCurrentImage(image)}
              >
                <img src={`data:image/jpeg;base64,${image}`} alt="" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="detail-content-2">
        <div className="row-1">
          <button
            className="booking-btn"
            onClick={() => navigate(routeConfig.calendar)}
          >
            <IoMdCalendar size={19} />
            <span>Đặt sân ngay</span>
          </button>
          <h3 className="introduction-title">Giới thiệu chung</h3>
          <p className="introduct-desc">{fieldDetail.description}</p>
        </div>

        <div className="row-2">
          <h4>Đánh giá</h4>
          <div className="review-content">
            <div className="list-comment">
              <Comment />
              <Comment />
              <Comment />
              <Comment />
            </div>

            <div className="write-comment">
              <input
                type="text"
                placeholder="Viết đánh giá của bạn..."
                className="comment-text"
              />
              <button className="btn btn-primary btn-send">Gửi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldDetail;
