// import { useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

import "./AccountOwner.scss";

function AccountOwner({ ownerData }) {
  return (
    <div className="account-owner">
      <div className="avatar-owner">
        {ownerData.avatar ? (
          <img src={`data:image/jpeg;base64, ${ownerData.avatar}`} alt="ảnh" />
        ) : (
          <FaUserTie color="white" />
        )}
      </div>
      <p className="name-owner">{ownerData.name} </p>
      <FaChevronDown size={13} />
    </div>
  );
}

export default AccountOwner;
