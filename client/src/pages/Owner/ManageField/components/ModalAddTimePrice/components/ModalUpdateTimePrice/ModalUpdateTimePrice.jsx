import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import _ from "lodash";
import { toast } from "react-toastify";

import updateTimePrice from "~/services/Field/updateTimePrice";

function ModalUpdateTimePrice({
  showModalUpdate,
  setShowModalUpdate,
  fieldId,
  timePrice,
  fetchListTimePrice,
}) {
  const [timePriceId, setTimePriceId] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!_.isEmpty(timePrice)) {
      setTimePriceId(timePrice._id);
      setPrice(timePrice.price);
    }
  }, [timePrice]);

  const handleClose = () => {
    setShowModalUpdate(false);
    setTimePriceId(timePrice._id);
    setPrice(timePrice.price);
  };

  const handleUpdatePrice = async () => {
    console.log("Check update", { fieldId, timePriceId });

    const res = await updateTimePrice(fieldId, timePriceId, price);

    if (res.EC === 1) {
      toast.success(res.EM);
      fetchListTimePrice();
      handleClose();
    } else {
      toast.error(res.EM);
    }
  };
  return (
    <>
      <Modal
        show={showModalUpdate}
        onHide={handleClose}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Sửa giá tiền?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-12">
            <label className="form-label">Giá tiền</label>
            <input
              type="number"
              className="form-control"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleUpdatePrice}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalUpdateTimePrice;
