import Table from "~/components/Table/Table";
import "./ManageOwner.scss";

function ManageOwner() {
  const header = [
    { title: "Business name", key: "business_name" },
    { title: "Address", key: "address" },
    { title: "Email", key: "email" },
    { title: "Phone number", key: "phone_number" },
    { title: "Status", key: "account_status" },
    { title: "Action" },
  ];

  const data = [
    {
      business_name: "abc",
      address: "abc",
      phone_number: "123-456-789",
      email: "abc@gmail.com",
      account_status: "active",
    },

    {
      business_name: "bcd",
      address: "bcd",
      phone_number: "789-456-123",
      email: "bcd@gmail.com",
      account_status: "active",
    },
  ];

  return (
    <div className="manage-owner-container">
      <h3>Thông tin chủ sân</h3>
      <Table header={header} data={data} totalPage={3} />
    </div>
  );
}

export default ManageOwner;
