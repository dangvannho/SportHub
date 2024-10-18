import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import deleteOwner from "~/services/Owner/deleteOwner";
import getAllOnwer from "~/services/Owner/getAllOwner";

function ModalDeleteOwner({
  showModalDelete,
  setShowModalDelete,
  personalData,
  currentPage,
  setCurrentPage,
  fetchAllOwner,
  itemsPerPage,
}) {
  const handleClose = () => setShowModalDelete(false);

  const handleSubmitDeleteOwner = async () => {
    const res = await deleteOwner(personalData._id);
    toast.success(res.message);
    handleClose();
    // Fetch lại danh sách người dùng
    const data = await getAllOnwer(currentPage, itemsPerPage);

    // Kiểm tra nếu không còn người dùng nào
    if (data.results.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1); // Giảm trang
    } else {
      // Nếu như còn người dùng thì gọi api của trang đó
      fetchAllOwner();
    }
  };

  return (
    <>
      <Modal show={showModalDelete} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Xoá chủ sân?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có muốn xoá chủ sân có email:
          <strong> {personalData.email ? personalData.email : ""} ?</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSubmitDeleteOwner();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDeleteOwner;
