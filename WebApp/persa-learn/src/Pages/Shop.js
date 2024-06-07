import React, { useState, useEffect } from "react";
import BannerOverlay from "../Components/Shop/Overlays/BannerOverlay";
import ProfilePictureOverlay from "../Components/Shop/Overlays/ProfilePictureOverlay";
import ThemeOverlay from "../Components/Shop/Overlays/ThemeOverlay";
import ShopItem from "../Components/Shop/ShopItem";
import ThemeItem from "../Components/Shop/ThemeItem";
import Banner from "../Components/StudentProfile/Banner";
import {
  getAllBanners,
  getAllProfilePics,
  getAllThemes,
  getUnpurchasedItems,
} from "../http_Requests/StudentRequests/ItemRequests";
import { getUserDetails } from "../http_Requests/userRequests";
import styles from "./Shop.module.css";

//icons from: https://www.flaticon.com/authors/roundicons/circle-flat

const Shop = () => {
  const [name, setName] = useState("");
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(1);
  const [profilePic, setProfilePic] = useState("");
  const [banner, setBanner] = useState("");
  const [requiredXp, setRequireXp] = useState(0);
  const [xp, setXp] = useState(0);

  const [allBanners, setAllBanners] = useState([]);
  const [allThemes, setAllThemes] = useState([]);
  const [allProfilePics, setAllProfilePics] = useState([]);

  const [selectedItem, setSelectedItem] = useState();
  const [isProfilePicSelected, setIsProfilePicSelected] = useState(false);
  const [isBannerSelected, setIsBannerSelected] = useState(false);
  const [isThemeSelected, setIsThemeSelected] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0);
  const [tabs, setTabs] = useState([
    "All",
    "Profile Pictures",
    "Banners",
    "Themes",
  ]);

  const profilePicSelected = (item) => {
    setSelectedItem(item);
    setIsProfilePicSelected(true);
  };
  const bannerSelected = (item) => {
    setSelectedItem(item);
    setIsBannerSelected(true);
  };
  const themeSelected = (item) => {
    setSelectedItem(item);
    setIsThemeSelected(true);
  };
  const itemSelected = (item) => {
    setSelectedItem(item);
    // setIsSelected(true);
  };
  const getItems = async () => {
    let data = await getAllBanners();
    setAllBanners(data.data);
    data = await getAllThemes();
    console.log(data.data);
    setAllThemes(data.data);
    data = await getAllProfilePics();
    setAllProfilePics(data.data);
  };

  const getStudentDetails = async () => {
    let data = await getUserDetails();
    console.log(data);
    if (data.status === "success") {
      setName(`${data.data.FirstName} ${data.data.LastName}`);
      setCoins(data.data.Coins);
      setLevel(data.data.Level);
      setProfilePic(data.data.ProfilePicture);
      setBanner(data.data.Banner);
      setRequireXp(data.data.RequiredXp);
      setXp(data.data.Xp);
    }
  };

  useEffect(async () => {
    await getItems();
    await getStudentDetails();
  }, []);
  return (
    <div className="content-box">
      {/* <div className="container wide-container center-container"> */}
      <h1>Shop</h1>
      <div className={styles.container}>
        <Banner
          banner={banner}
          level={level}
          profilePicture={profilePic}
          usersName={name}
          coins={coins}
          xp={xp}
          requiredXp={requiredXp}
        />
        <div className={styles.tabs}>
          {tabs.map((tab, i) => {
            // highlight selected tab
            let isSelected = false;
            if (i === selectedTab) {
              isSelected = true;
            }
            return (
              <h2
                key={i}
                tabIndex={0}
                role="button"
                aria-selected={isSelected}
                onClick={() => setSelectedTab(i)}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) setSelectedTab(i);
                }}
              >
                {tab}
              </h2>
            );
          })}
        </div>
        <div className={styles.items_container}>
          {selectedTab === 0 ? (
            <>
              {allProfilePics.length + allBanners.length + allThemes.length ==
              0 ? (
                <p>
                  Looks like where out of stock... <br />
                  Come back another time
                </p>
              ) : (
                allProfilePics.map((item) => (
                  <ShopItem
                    key={item.ProfilePictureID}
                    itemID={item.ProfilePictureID}
                    type={"Profile Picture"}
                    name={item.Name}
                    image={item.Image}
                    details={item.Details}
                    cost={item.Cost}
                    requiredLevel={item.RequiredLevel}
                    itemSelected={profilePicSelected}
                    isPurchased={item.Caption == "Purchased"}
                  />
                ))
              )}
              {allBanners.map((item) => (
                <ShopItem
                  key={item.BannerID}
                  itemID={item.BannerID}
                  type={"Banner"}
                  name={item.Name}
                  image={item.Image}
                  details={item.Details}
                  cost={item.Cost}
                  requiredLevel={item.RequiredLevel}
                  itemSelected={bannerSelected}
                  isPurchased={item.Caption == "Purchased"}
                />
              ))}
              {allThemes.map((item) => (
                <ThemeItem
                  key={item.ThemeID}
                  itemID={item.ThemeID}
                  type={"Theme"}
                  name={item.Name}
                  image={item.Image}
                  details={item.Details}
                  cost={item.Cost}
                  requiredLevel={item.RequiredLevel}
                  primary={item.PrimaryColor}
                  background={item.BackgroundColor}
                  isDark={item.IsDark}
                  itemSelected={themeSelected}
                  isPurchased={item.Caption == "Purchased"}
                />
              ))}
            </>
          ) : selectedTab === 1 ? (
            allProfilePics.map((item) => (
              <ShopItem
                key={item.ProfilePictureID}
                itemID={item.ProfilePictureID}
                type={"Profile Picture"}
                name={item.Name}
                image={item.Image}
                details={item.Details}
                cost={item.Cost}
                requiredLevel={item.RequiredLevel}
                itemSelected={profilePicSelected}
                isPurchased={item.Caption == "Purchased"}
              />
            ))
          ) : selectedTab === 2 ? (
            allBanners.map((item) => (
              <ShopItem
                key={item.BannerID}
                itemID={item.BannerID}
                type={"Banner"}
                name={item.Name}
                image={item.Image}
                details={item.Details}
                cost={item.Cost}
                requiredLevel={item.RequiredLevel}
                itemSelected={bannerSelected}
                isPurchased={item.Caption == "Purchased"}
              />
            ))
          ) : (
            allThemes.map((item) => (
              <ThemeItem
                key={item.ThemeID}
                itemID={item.ThemeID}
                type={"Theme"}
                name={item.Name}
                image={item.Image}
                details={item.Details}
                cost={item.Cost}
                requiredLevel={item.RequiredLevel}
                primary={item.PrimaryColor}
                background={item.BackgroundColor}
                isDark={item.IsDark}
                itemSelected={themeSelected}
                isPurchased={item.Caption == "Purchased"}
              />
            ))
          )}
        </div>
      </div>

      {isProfilePicSelected ? (
        <ProfilePictureOverlay
          getItems={getItems}
          selectedItem={selectedItem}
          close={() => setIsProfilePicSelected(false)}
        />
      ) : (
        <></>
      )}
      {isBannerSelected ? (
        <BannerOverlay
          selectedItem={selectedItem}
          close={() => setIsBannerSelected(false)}
          getItems={getItems}
        />
      ) : (
        <></>
      )}
      {isThemeSelected ? (
        <ThemeOverlay
          close={() => setIsThemeSelected(false)}
          getItems={getItems}
          selectedItem={selectedItem}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Shop;
