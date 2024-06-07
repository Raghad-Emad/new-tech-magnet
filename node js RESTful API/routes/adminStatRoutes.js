if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config({ path: "./.env" });
}

const express = require("express");
const router = express.Router();
const pool = require("../config/db");
// const bcrypt = require("bcrypt");
// const { check, validationResult } = require("express-validator");
// const JWT = require("jsonwebtoken");
// const checkAuth = require("../middleware/checkAuth");

router.route("/").get(async (req, res) => {
  const query = `CALL Monthly_signups()`;
  console.log(query);
  const [[signUps]] = await pool.query(query).catch((err) => {
    // throw err;
    return res.status(400).json({ status: "failure", reason: err });
  });
  // console.log(results);
  return res.status(200).json({
    status: "success",
    data: signUps,
  });
});

module.exports = router;
