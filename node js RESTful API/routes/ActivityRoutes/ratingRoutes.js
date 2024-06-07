if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config({ path: "./.env" });
}

const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const JWT = require("jsonwebtoken");
const checkAuth = require("../../middleware/checkAuth");

// create module
router.route("/").post(
  [
    check("quizID", "Invalid quiz id").not().isEmpty(),
    check("rating", "Rating must be between 1 and 5").isInt({
      min: 1,
      max: 5,
    }),
  ],
  checkAuth,
  async (req, res) => {
    try {
      //get these values from check auth (JWT)
      const email = req.user.email;
      const password = req.user.password;

      const data = {
        quizID: req.body.quizID,
        rating: req.body.rating,
      };

      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        console.log(errs);
        return res.status(400).json({
          errors: errs.array(),
        });
      }

      let query = `CALL rating_create ("${data.quizID}","${data.rating}","${email}","${password}")`;
      await pool.query(query).catch((err) => {
        // throw err;
        return res.status(400).json({ status: "failure", reason: err });
      });
      // console.log(results);
      return res.status(200).json({
        status: "success",
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);

//get average rating
router
  .route("/average")
  .get(
    [check("quizID", "Invalid quiz id").not().isEmpty()],
    async (req, res) => {
      try {
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        let query = `CALL rating_quiz_ave("${req.query.quizID}")`;

        const [average] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({
          status: "success",
          average,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

module.exports = router;
