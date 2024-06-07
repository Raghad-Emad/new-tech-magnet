import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import Banner from "../../Components/Admin/AllBanners/Banner";
import OverlayAdd from "../../Components/Admin/AllBanners/OverlayAdd";
import OverlayDetails from "../../Components/Admin/AllBanners/OverlayDetails";
import CustomButton from "../../Components/CustomButton";
import { getAllBannersAdmin } from "../../http_Requests/StudentRequests/ItemRequests";
import styles from "./BannersAll.module.css";

const BannersAll = () => {
  const [allBanners, setAllBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  //   const navigate = useNavigate();

  const getAllBanners = async () => {
    const data = await getAllBannersAdmin();
    console.log(data);
    setAllBanners(data.data);
  };

  useEffect(async () => {
    await getAllBanners();
  }, []);

  const bannerSelected = (id, name, details, image, cost, requiredLevel) => {
    setSelectedBanner(id, name, details, image, cost, requiredLevel);
    setShowDetails(true);
  };

  return (
    <div className="content-box">
      <h1>All Banners</h1>
      {/* <div className="container"> */}
      <div className={styles.container}>
        <h2>Banners</h2>
        <div className={styles.banners_container}>
          {allBanners.map((banner) => (
            <Banner
              key={banner.BannerID}
              id={banner.BannerID}
              name={banner.Name}
              details={banner.Details}
              image={banner.Image}
              cost={banner.Cost}
              requiredLevel={banner.RequiredLevel}
              bannerSelected={bannerSelected}
            />
          ))}

          <CustomButton
            text={"Add Theme"}
            type={3}
            floating={true}
            onClick={() => setShowAdd(true)}
          />
        </div>
      </div>
      {showDetails ? (
        <OverlayDetails
          selectedBanner={selectedBanner}
          getAllBanners={getAllBanners}
          close={() => setShowDetails(false)}
        />
      ) : (
        <></>
      )}
      {showAdd ? (
        <OverlayAdd
          getAllBanners={getAllBanners}
          close={() => setShowAdd(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default BannersAll;
