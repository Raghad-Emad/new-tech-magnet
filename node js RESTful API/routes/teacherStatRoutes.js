if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config({ path: "./.env" });
}

const express = require("express");
const router = express.Router();
const pool = require("../config/db");
// const bcrypt = require("bcrypt");
// const { check, validationResult } = require("express-validator");
// const JWT = require("jsonwebtoken");
const checkAuth = require("../middleware/checkAuth");

router.route("/assignment/Progress").get(checkAuth, async (req, res) => {
  //get these values from check auth (JWT)
  const email = req.user.email;
  const password = req.user.password;

  const query = `CALL all_assignment_progress('${email}','${password}')`;
  const [[assignProgr]] = await pool.query(query).catch((err) => {
    // throw err;
    return res.status(400).json({ status: "failure", reason: err });
  });
  // console.log(results);
  return res.status(200).json({
    status: "success",
    data: assignProgr,
  });
});

router.route("/assignment/Rating").get(checkAuth, async (req, res) => {
  //get these values from check auth (JWT)
  const email = req.user.email;
  const password = req.user.password;

  const query = `CALL assignment_ratings_by_teacher('${email}','${password}')`;
  console.log(query);
  const [[ratings]] = await pool.query(query).catch((err) => {
    // throw err;
    return res.status(400).json({ status: "failure", reason: err });
  });
  // console.log(results);
  return res.status(200).json({
    status: "success",
    data: ratings,
  });
});

module.exports = router;
