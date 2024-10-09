import { IoMdStar } from "react-icons/io";
import "./Comment.scss";

function Comment() {
  return (
    <div className="comment-container">
      <h5 className="name-user">Dũng Trần</h5>
      <div className="rating-container">
        <div className="rating-group">
          <IoMdStar color="#ff7b01" />
          <IoMdStar color="#ff7b01" />
          <IoMdStar color="#ff7b01" />
          <IoMdStar color="#ff7b01" />
          <IoMdStar color="#ff7b01" />
        </div>
        <span className="date">5 tháng trước</span>
      </div>
      <p className="comment-desc">
        Mặt cỏ đẹp, loại cỏ trồng là cỏ lá gừng, rất nhiều sân bóng V League
        cũng đang sử dụng cỏ này.{" "}
      </p>
    </div>
  );
}

export default Comment;
