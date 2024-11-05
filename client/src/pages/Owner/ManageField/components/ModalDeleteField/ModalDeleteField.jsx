import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import deleteField from "~/services/Field/deleteField";
import getAllFieldOwner from "~/services/Field/getAllFieldOwner";

function ModalDeleteField({
  showModalDelete,
  setShowModalDelete,
  personalData,
  currentPage,
  setCurrentPage,
  fetchAllFieldOwner,
  itemsPerPage,
}) {
  const handleClose = () => setShowModalDelete(false);

  const handleSubmitDeleteField = async () => {
    const res = await deleteField(personalData._id);
    if (res.EC === 1) {
      toast.success(res.EM);
      handleClose();
      // Fetch lại danh sách người dùng
      const data = await getAllFieldOwner(currentPage, itemsPerPage);

      // Kiểm tra nếu không còn người dùng nào
      if (data.results.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1); // Giảm trang
      } else {
        // Nếu như còn người dùng thì gọi api của trang đó
        fetchAllFieldOwner();
      }
    } else {
      toast.error(res.EM);
    }
  };
  return (
    <>
      <Modal show={showModalDelete} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Xoá sân?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có muốn xoá sân có tên là:
          <strong> {personalData.name}?</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSubmitDeleteField();
            }}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDeleteField;
