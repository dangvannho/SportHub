import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import deleteTimePrice from "~/services/Field/deleteTimePrice";

function ModalDeleteTimePrice({
  showModalDelete,
  setShowModalDelete,
  fieldId,
  timePrice,
  fetchListTimePrice,
}) {
  const handleClose = () => setShowModalDelete(false);

  console.log(timePrice);

  const handleDeletePriceTime = async () => {
    const res = await deleteTimePrice(fieldId, timePrice._id);

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
        show={showModalDelete}
        onHide={handleClose}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xoá khung giờ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xoá khung giờ này ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleDeletePriceTime}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDeleteTimePrice;
