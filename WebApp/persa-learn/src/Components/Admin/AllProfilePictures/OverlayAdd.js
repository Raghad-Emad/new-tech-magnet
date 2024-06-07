import React, { useState } from "react";
import CustomButton from "../../CustomButton";
import CustomInput from "../../CustomInput";
import styles from "./OverlayAdd.module.css";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import {
  addBannerAdmin,
  addProfilePictureAdmin,
} from "../../../http_Requests/StudentRequests/ItemRequests";

const OverlayAdd = ({ close, getProfilePictures }) => {
  const [isMagnified, setIsMagnified] = useState(false);

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [cost, setCost] = useState(0);
  const [requiredLevel, setRequiredLevel] = useState(1);

  const addDetails = async () => {
    const data = await addProfilePictureAdmin({
      Name: name,
      Details: details,
      Image: image,
      Cost: cost,
      RequiredLevel: requiredLevel,
    });
    if (data.status == "success") {
      getProfilePictures();
      // close();
    }
    // const data = await editProfilePictureAdmin({
    //   Name: name,
    //   Details: details,
    //   Image: image,
    //   Cost: cost,
    //   RequiredLevel: requiredLevel,
    // });
    // if (data.status == "success") {
    //   getProfilePictures();
    //   // close();
    // }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.message_box}>
        <h1>Create New Banner</h1>
        <h2>Name</h2>
        <CustomInput setValue={setName} value={name} />
        <h2>Details</h2>
        <CustomInput setValue={setDetails} value={details} />
        <h2>Image (URL)</h2>
        <CustomInput setValue={setImage} value={image} />
        <div
          className={styles.previewImage}
          onClick={() => setIsMagnified(!isMagnified)}
        >
          <p>Preview Image</p>
          <div
            className={styles.image}
            style={Object.assign(isMagnified ? { transform: "scale(2)" } : {}, {
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            })}
          >
            <p>{isMagnified ? <MdZoomOut /> : <MdZoomIn />}</p>
          </div>
        </div>
        <h2>Cost</h2>
        <CustomInput setValue={setCost} value={cost} />
        <h2>Required Level</h2>
        <CustomInput setValue={setRequiredLevel} value={requiredLevel} />

        <CustomButton text={"Create Theme"} onClick={addDetails} />
        <CustomButton text={"Back"} type={2} onClick={close} />
      </div>
    </div>
  );
};

export default OverlayAdd;
