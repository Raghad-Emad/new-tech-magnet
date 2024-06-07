import React, { useState, useEffect } from "react";
import { getPurchasedBanners } from "../../http_Requests/StudentRequests/ItemRequests";
import { updateBanner } from "../../http_Requests/StudentRequests/StudentRequests";
import CustomButton from "../CustomButton";
import BannerSelect from "./BannerSelect";
import styles from "./BannerSelector.module.css";

const BannerSelector = ({ close, getDetails }) => {
  const [selectedBanner, setSelectedBanner] = useState();
  const [banners, setBanners] = useState([]);

  const getBanners = async () => {
    const data = await getPurchasedBanners();
    console.log("this", data);
    if (data.status === "success") {
      setBanners(data.data);
    }
  };
  useEffect(async () => {
    await getBanners();
  }, []);
  const updatePicture = async () => {
    if (selectedBanner != null) {
      const data = await updateBanner({ Banner: selectedBanner });
      await getDetails();
      close();
    } else alert("Select a banner");
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h2>Select a banner</h2>
        <div className={styles.all_picture_container}>
          {banners.map((banner, i) => (
            <BannerSelect
              image={banner.Image}
              bannerSelected={setSelectedBanner}
              selected={selectedBanner === banner.Image ? true : false}
              key={i}
            />
          ))}
        </div>
        <div className={styles.button_container}>
          <CustomButton text={"Confirm"} onClick={updatePicture} />
          <CustomButton text={"Back"} type={2} onClick={close} />
        </div>
      </div>
    </div>
  );
};

export default BannerSelector;
