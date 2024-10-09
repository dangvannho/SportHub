function FieldItem() {
  return (
    <div className="field-item">
      <div className="field-item__image">
        <img
          src="https://images.unsplash.com/photo-1517747614396-d21a78b850e8?q=80&w=2225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
      </div>
      <h4 className="field-item__name">Sân bóng Duy Hưng - ĐH Sư phạm</h4>
      <div className="field-info">
        <div className="field-info__sdt">
          <i className="fa-solid fa-mobile"></i>
          <span>0856860456 - Anh Hưng</span>
        </div>
        <div className="field-info__address">
          <i className="fa-solid fa-location-dot"></i>
          <span>Số 2 Phạm Văn Đồng</span>
        </div>
      </div>
      <button className="button-detail">Chi tiết</button>
    </div>
  );
}

export default FieldItem;
