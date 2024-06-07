import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

import { MdMenu } from "react-icons/md";

import logo from "../assets/Logo.jpg";

const Navbar = () => {
  const [navVisibility, setNavVisibility] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [isTeacher, setIsTeacher] = useState(
    sessionStorage.getItem("teacher") === "true"
  );
  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem("admin") === "true"
  );
  const navigate = useNavigate();

  const navToggle = () => {
    setNavVisibility(!navVisibility);
  };

  const logout = (e) => {
    navigate("/", {});
    sessionStorage.clear();
    window.location.reload();
  };

  const login = () => {
    navigate("/login");
  };

  const signup = () => {
    navigate("/signup");
  };

  return (
    <header className={styles.primary_header} data-testid={"navbar"}>
      <div className={styles.logo_container}>
        <img src={logo} alt="logo" className={styles.logo} />
      </div>
      <button
        className={styles.mobile_nav_toggle}
        aria-controls="primary-navigation"
        aria-expanded={navVisibility}
        onClick={navToggle}
      >
        <MdMenu aria-label="menu" />
      </button>
      <nav>
        <ul
          id="primary-navigation"
          data-visible={navVisibility}
          className={styles.primary_navigation}
        >
          {!token ? (
            <></>
          ) : isAdmin ? (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li>
                <Link to="/account">Profile</Link>
              </li>
            </>
          ) : !isTeacher ? (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/classes">Classes</Link>
              </li>
              <li>
                <Link to="/revision">Revision</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/classes">Classes</Link>
              </li>
              <li>
                <Link to="/details_teacher">Profile</Link>
              </li>
            </>
          )}
          {!token ? (
            <>
              <li>
                <a onClick={login}>Sign In</a>
              </li>
              <li>
                <a onClick={signup}>Sign Up</a>
              </li>
            </>
          ) : (
            <li>
              <a href="#" onClick={logout}>Logout</a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
