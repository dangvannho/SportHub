import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import ModalUpdateTimePrice from "./components/ModalUpdateTimePrice/ModalUpdateTimePrice";
import ModalDeleteTimePrice from "./components/ModalDeleteTimePrice/ModalDeleteTimePrice";
import addTimePrice from "~/services/Field/addTimePrice";
import getAllTimePrice from "~/services/Field/getAllTimePrice";
import generateTime from "~/services/Field/generateTime";
import "./ModalAddTimePrice.scss";

function ModalAddTimePrice({
  showModalAddTimePrice,
  setShowModalAddTimePrice,
  personalData,
}) {
  const [fieldId, setFieldId] = useState("");
  const [timePrice, setTimePrice] = useState({});
  const [startHour, setStartHour] = useState("05"); // Giờ bắt đầu (5-22h)
  const [startMinute, setStartMinute] = useState("00"); // Phút bắt đầu (00 hoặc 30)
  const [endHour, setEndHour] = useState("06"); // Giờ kết thúc (6-23h)
  const [endMinute, setEndMinute] = useState("00"); // Phút kết thúc (00 hoặc 30)
  const [price, setPrice] = useState("");
  const [dayType, setDayType] = useState(false);
  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Ngày kết thúc

  const [listPrice, setListPrice] = useState([]);

  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShowModalAddTimePrice(false);
    resetFields();
  };

  useEffect(() => {
    if (personalData) {
      setFieldId(personalData._id);
    }
  }, [personalData]);

  useEffect(() => {
    if (fieldId) {
      fetchListTimePrice();
    }
  }, [fieldId]);

  // Lấy tất cả các giá và giờ
  const fetchListTimePrice = async () => {
    const res = await getAllTimePrice(fieldId);
    if (res.EC === 1) {
      setListPrice(res.priceSlots);
    } else {
      toast.error(res.EM);
    }
  };

  const resetFields = () => {
    setStartHour("05");
    setStartMinute("00");
    setEndHour("06");
    setEndMinute("00");
    setPrice("");
    setStartDate("");
    setEndDate("");
  };

  // Thêm giờ và giá
  const handleAddTimePrice = async () => {
    const trimPrice = price.trim();

    const numericPrice = parseFloat(trimPrice);

    // Tạo giờ bắt đầu và kết thúc dạng hh:mm
    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;

    if (parseInt(startHour) >= parseInt(endHour) && startMinute >= endMinute) {
      toast.error("Giờ kết thúc phải lớn hơn giờ bắt đầu!");
      return;
    }

    if (trimPrice === "" || parseFloat(trimPrice) <= 0) {
      toast.error("Giá tiền phải lớn hơn 0!");
      return;
    }

    const res = await addTimePrice(
      fieldId,
      startTime,
      endTime,
      numericPrice,
      dayType
    );

    if (res.EC === 1) {
      toast.success(res.EM);
    } else {
      toast.error(res.EM);
    }

    fetchListTimePrice();
  };

  // Tạo giờ tự động
  const handleGenerateTime = async () => {
    if (!startDate) {
      toast.error("Ngày bắt đầu không được để trống!");
      return;
    }

    if (!endDate) {
      toast.error("Ngày kết thúc không được để trống!");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
      return;
    }

    setLoading(true);

    const res = await generateTime(fieldId, startDate, endDate);
    if (res.EC === 1) {
      setLoading(false);
      toast.success(res.EM);
    } else {
      toast.error(res.EM);
    }
  };
  return (
    <>
      <Modal
        show={showModalAddTimePrice}
        onHide={handleClose}
        backdrop="static"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm giờ và giá sân</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="row row-custom">
            {/* Chọn ngày */}
            <div className="col-md-12">
              <label className="form-label">Chọn loại ngày</label>
              <select
                className="form-control"
                value={dayType}
                onChange={(e) => setDayType(e.target.value === "true")}
              >
                <option value={false}>Ngày thường</option>
                <option value={true}>Cuối tuần</option>
              </select>
            </div>

            {/* Giờ bắt đầu */}
            <div className="col-md-2">
              <label className="form-label">Giờ bắt đầu</label>
              <select
                className="form-control"
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
              >
                {[...Array(18)].map((_, i) => {
                  const hour = (i + 5).toString().padStart(2, "0");
                  return (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label" style={{ color: "transparent" }}>
                Phút bắt đầu
              </label>
              <select
                className="form-control"
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
              >
                <option value="00">00</option>
                <option value="30">30</option>
              </select>
            </div>

            {/* Giờ kết thúc */}
            <div className="col-md-2">
              <label className="form-label">Giờ kết thúc</label>
              <select
                className="form-control"
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
              >
                {[...Array(18)].map((_, i) => {
                  const hour = (i + 6).toString().padStart(2, "0");
                  return (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label" style={{ color: "transparent" }}>
                Phút kết thúc
              </label>
              <select
                className="form-control"
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
              >
                <option value="00">00</option>
                <option value="30">30</option>
              </select>
            </div>

            {/* Giá tiền */}
            <div className="col-md-12">
              <label className="form-label">Giá tiền</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
              />
            </div>

            {/* Thêm giờ và giá */}
            <div className="col-md-12 ">
              <Button variant="primary" onClick={handleAddTimePrice}>
                Thêm
              </Button>
            </div>

            <h4 className="col-md-12 mt-2 mb-0">Bảng giá theo giờ</h4>
            {/* Bảng giá tiền */}

            <div style={{ maxHeight: "327px", overflowY: "auto" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Giờ bắt đầu</th>
                    <th>Giờ kết thúc</th>
                    <th>Giá tiền</th>
                    <th>Loại ngày</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {listPrice.map((item, index) => (
                    <tr key={index}>
                      <td>{item.startHour}</td>
                      <td>{item.endHour}</td>
                      <td>{item.price}</td>
                      {item.is_weekend ? (
                        <td>Cuối tuần</td>
                      ) : (
                        <td>Ngày thường</td>
                      )}
                      <td style={{ display: "flex", gap: "0 5px" }}>
                        <Button
                          variant="warning"
                          className="mx-1"
                          onClick={() => {
                            setShowModalUpdate(true);
                            setTimePrice(item);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="danger"
                          className="mx-1"
                          onClick={() => {
                            setShowModalDelete(true);
                            setTimePrice(item);
                          }}
                        >
                          Xoá
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <h4 className="col-md-12 m-0">Tạo khung giờ tự động</h4>
            <div className="col-md-12 d-flex gap-4 ">
              {/* Ngày bắt đầu */}
              <div className="col-md-3 mt-1">
                <label className="form-label">Ngày bắt đầu</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* Ngày kết thúc */}
              <div className="col-md-3 mt-1">
                <label className="form-label">Ngày kết thúc</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* Nút tạo khung giờ */}
              <div className="col-md-2 align-self-end">
                <Button variant="success" onClick={handleGenerateTime}>
                  Tạo khung giờ
                </Button>
              </div>

              {loading && (
                <AiOutlineLoading3Quarters
                  size={20}
                  color="#0d6efd"
                  className="icon-loading"
                />
              )}
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal update */}
      <ModalUpdateTimePrice
        showModalUpdate={showModalUpdate}
        setShowModalUpdate={setShowModalUpdate}
        fieldId={fieldId}
        timePrice={timePrice}
        fetchListTimePrice={fetchListTimePrice}
      />

      {/* Modal delte */}
      <ModalDeleteTimePrice
        showModalDelete={showModalDelete}
        setShowModalDelete={setShowModalDelete}
        fieldId={fieldId}
        timePrice={timePrice}
        fetchListTimePrice={fetchListTimePrice}
      />
    </>
  );
}

export default ModalAddTimePrice;
