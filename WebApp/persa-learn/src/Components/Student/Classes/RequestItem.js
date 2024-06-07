import React from "react";
import {
  acceptClassRequests,
  declineClassRequests,
} from "../../../http_Requests/StudentRequests/ClassRequestRequests";
import CustomButton from "../../CustomButton";
import styles from "./RequestItem.module.css";

const RequestItem = ({
  id,
  className,
  yearGroup,
  firstname,
  lastname,
  dateSent,
  getAllRequests,
  getAllClasses,
}) => {
  const accept = async () => {
    const data = await acceptClassRequests({ classID: id });
    console.log(data);
    if (data.status === "success") {
      getAllRequests();
      getAllClasses();
    }
  };
  const decline = async () => {
    const data = await declineClassRequests({ classID: id });
    console.log(data);
    if (data.status === "success") {
      getAllRequests();
    }
  };
  return (
    <div id={id} className={styles.request_item}>
      <p>{className}</p>
      <p>{yearGroup}</p>
      <p>{`${firstname} ${lastname}`}</p>
      <p>{dateSent ? new Date(dateSent).toLocaleDateString("en-GB") : ""}</p>

      <CustomButton text={"Accept"} onClick={accept} fill={true} />
      <CustomButton text={"Decline"} onClick={decline} type={2} fill={true} />
    </div>
  );
};

export default RequestItem;
