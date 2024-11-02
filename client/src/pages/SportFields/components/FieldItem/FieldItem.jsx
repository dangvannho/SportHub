import { useNavigate } from "react-router-dom";
import routeConfig from "~/config/routeConfig";

function FieldItem({ data }) {
  const navigate = useNavigate();
  return (
    <div className="field-item">
      <div className="field-item__image">
        {data.images.length > 0 ? (
          <img src={`data:image/jpeg;base64,${data.images[0]}`} alt="" />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1517747614396-d21a78b850e8?q=80&w=2225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        )}
      </div>
      <h4 className="field-item__name">{data.name}</h4>
      <div className="field-info">
        <div className="field-info__sdt">
          <i className="fa-solid fa-mobile"></i>
          <span>
            {data?.owner_id?.phone_number || "00000"} -
            {data?.owner_id?.business_name || "abc"}
          </span>
        </div>
        <div className="field-info__address">
          <i className="fa-solid fa-location-dot"></i>
          <span>{data.location}</span>
        </div>
      </div>
      <button
        className="button-detail"
        onClick={() =>
          navigate(routeConfig.fieldDetail.replace(":id", data._id))
        }
      >
        Chi tiết
      </button>
    </div>
  );
}

export default FieldItem;
