import { IoMdStar } from "react-icons/io";
import "./StarIcon.scss";

function StarIcon() {
  return (
    <div className="star-container">
      <IoMdStar size={18} className="icon" />
      <IoMdStar size={26} className="icon-2" />
      <IoMdStar size={18} className="icon" />
    </div>
  );
}

export default StarIcon;
