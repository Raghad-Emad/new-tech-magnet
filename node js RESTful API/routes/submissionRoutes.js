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

// share quiz submission
router
  .route("/")
  .put(
    [check("quizID", "Invalid Quiz ID").not().isEmpty()],
    checkAuth,
    async (req, res) => {
      try {
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        let query = `CALL quiz_submission_share ("${req.body.quizID}","${email}","${password}")`;
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

// stop sharing quiz submission
router
  .route("/")
  .delete(
    [check("quizID", "Invalid Quiz ID").not().isEmpty()],
    checkAuth,
    async (req, res) => {
      try {
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        let query = `CALL quiz_submission_share_delete ("${req.body.quizID}","${email}","${password}")`;
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

// get quiz submissions by student id
router
  .route("/class/student")
  .post(
    [
      check("studentID", "Invalid Quiz ID").not().isEmpty(),
      check("classID", "Invalid Quiz ID").not().isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      try {
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        const data = {
          studentID: req.body.studentID,
          classID: req.body.classID,
        };

        let query = `CALL quiz_submission_get_by_student (${data.studentID}, ${data.classID},"${email}","${password}")`;
        const [[submissions]] = await pool
          .query(query)
          .catch((err) => {
            // throw err;
            return res.status(400).json({ status: "failure", reason: err });
          })
          .then();
        // console.log(results);
        return res.status(200).json({
          status: "success",
          data: submissions,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

module.exports = router;
