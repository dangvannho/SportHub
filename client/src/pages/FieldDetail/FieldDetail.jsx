import { MdOutlineStar } from "react-icons/md";
import { IoMdCalendar } from "react-icons/io";
import Comment from "./components/Comment/Comment";
import "./FieldDetail.scss";

function FieldDetail() {
  return (
    <div className="field-detail-wrapper">
      <div className="heading">
        <h5 className="heading-name">Sân Ulis</h5>

        <ul className="heading-desc">
          <li className="star">
            4.6
            <MdOutlineStar color="#f9b90f" />
          </li>
          <li className="item-desc">100 Đánh giá</li>
          <li className="item-desc">Anh Linh</li>
          <li className="item-desc">Số 2 Phạm Văn Đồng</li>
        </ul>
      </div>

      <div className="detail-content">
        <div className="field-image">
          <img
            src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div>

        <div className="owner-info">
          <h3 className="owner-info__heading">Thông tin chủ sân</h3>
          <div className="owner-info__content">
            <div className="owner owner-name">
              <i className="fa-solid fa-user"></i>
              <span>Anh Linh</span>
            </div>

            <button className="owner owner-sdt">
              <i className="fa-solid fa-phone"></i>
              <span>0123456789</span>
            </button>

            <div className="owner owner-email">
              <i className="fa-solid fa-envelope"></i>
              <span>phungvanlinh195@gmail.com</span>
            </div>

            <div className="owner owner-address">
              <i className="fa-solid fa-location-dot"></i>
              <span>Số 2 Phạm Văn Đồng</span>
            </div>

            <div className="map">Bản đồ</div>
          </div>
        </div>
        <div className="silde-image">
          <div className="thumbnail">
            <img
              src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className="thumbnail">
            <img
              src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className="thumbnail">
            <img
              src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className="thumbnail">
            <img
              src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className="thumbnail">
            <img
              src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="detail-content-2">
        <div className="row-1">
          <button className="booking-btn">
            <IoMdCalendar size={19} />
            <span>Đặt sân ngay</span>
          </button>
          <h3 className="introduction-title">Giới thiệu chung</h3>
          <p className="introduct-desc">
            Sân bóng Ulis. Địa chỉ : Đại học Ngoại ngữ, số 2 Phạm Văn Đồng, Cầu
            Giấy, Hà Nội. Cụm sân gồm 2 sân bóng 7 người.
          </p>
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
