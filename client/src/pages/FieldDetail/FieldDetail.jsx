import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineStar } from "react-icons/md";
import { IoMdCalendar } from "react-icons/io";
import getFieldDetail from "~/services/Field/getFieldDetail";

import Comment from "./components/Comment/Comment";
import "./FieldDetail.scss";

function FieldDetail() {
  const { id } = useParams();
  const [fieldDetail, setFieldDetail] = useState({});

  useEffect(() => {
    fetchFieldDetail();
  }, []);

  const fetchFieldDetail = async () => {
    const data = await getFieldDetail(id);
    setFieldDetail(data);
  };

  const images = [
    "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1504305754058-2f08ccd89a0a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1434648957308-5e6a859697e8?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=2673&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const [currentImage, setCurrentImage] = useState(images[0]);

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
          <img src={currentImage} alt="" />
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

            <div className="map">Bản đồ</div>
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
                <img src={image} alt="" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="detail-content-2">
        <div className="row-1">
          <button className="booking-btn">
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
