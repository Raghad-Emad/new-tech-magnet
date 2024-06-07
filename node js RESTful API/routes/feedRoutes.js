if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config({ path: "./.env" });
}

const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const checkAuth = require("../middleware/checkAuth");
const { check, validationResult } = require("express-validator");

// get feed
router.route("/").get(checkAuth, async (req, res) => {
  try {
    //get these values from check auth (JWT)
    const email = req.user.email;
    const password = req.user.password;

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({
        errors: errs.array(),
      });
    }

    let query = `CALL feed_get ("${email}","${password}")`;
    const [[feed]] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(200).json({
      status: "success",
      data: feed,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
