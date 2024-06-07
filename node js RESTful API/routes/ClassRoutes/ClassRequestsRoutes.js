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

//get students class request
router.route("/student").get(checkAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const password = req.user.password;

    const query = `CALL class_request_view_student ("${email}", "${password}")`;
    const [results] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    if (results === null) {
      return res.status(204).json({ status: "Not found" });
    } else {
      // console.log(results[0]);
      return res.status(200).json({ status: "success", data: results[0] });
    }
    // pool.query(query, (error, results) => {
    //   if (results === null) {
    //     return res.status(204).json({ status: "Not found" });
    //   } else {
    //     // console.log(results[0]);
    //     return res.status(200).json({ status: "success", data: results[0] });
    //   }
    // });
  } catch (e) {
    return res.status(400).json({ status: "failure", reason: e });
  }
});

// Get teachers sent class requests
router.route("/teacher/all").get(checkAuth, async (req, res) => {
  try {
    //get these values from check auth (JWT)
    const email = req.user.email;
    const password = req.user.password;

    const query = `CALL class_request_view_teacher ("${email}", "${password}")`;
    pool.query(query, (error, results) => {
      if (error) {
        return res.status(400).json({ status: "failure", reason: error.code });
      } else {
        if (results === null) {
          return res.status(204).json({ status: "Not found" });
        } else {
          return res.status(200).json({ status: "success", data: results[0] });
        }
      }
    });
  } catch (e) {
    return res.status(400).json({ status: "failure", reason: e });
  }
});

// Get teachers sent class requests
router
  .route("/teacher/class")
  .post(
    [
      check("classID", "A class ID is required").not().isEmpty(),
      check("searchTerm", "A class ID is required").not().isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      try {
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;
        const data = {
          classID: req.body.classID,
          searchTerm: req.body.searchTerm,
        };
        const query = `CALL class_request_view_all_students (${data.classID},"${data.searchTerm}","${email}", "${password}")`;
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        console.log(results);
        if (results === null) {
          return res.status(204).json({ status: "Not found" });
        } else {
          return res.status(200).json({ status: "success", data: results[0] });
        }
        // pool.query(query, (error, results) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     if (results === null) {
        //       return res.status(204).json({ status: "Not found" });
        //     } else {
        //       return res
        //         .status(200)
        //         .json({ status: "success", data: results[0] });
        //     }
        //   }
        // });
      } catch (e) {
        return res.status(400).json({ status: "failure", reason: e });
      }
    }
  );

//create class request
router
  .route("/teacher")
  .post(
    [
      check("classID", "A class ID is required").not().isEmpty(),
      check("studentID", "A student ID is required").not().isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        console.log(errs);
        return res.status(400).json({
          errors: errs.array(),
        });
      }
      //get these values from check auth (JWT)
      const email = req.user.email;
      const password = req.user.password;
      try {
        const data = {
          classID: req.body.classID,
          studentID: req.body.studentID,
        };

        const query = `CALL class_request_send ("${data.classID}", ${data.studentID}, "${email}", "${password}")`;
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(201).json({
          status: "success",
          data: data,
          message: "sent request",
        });
        // pool.query(query, (error, results) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     return res.status(201).json({
        //       status: "success",
        //       data: data,
        //       message: "sent request",
        //     });
        //   }
        // });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

// cancel class request
router
  .route("/teacher")
  .delete(
    [
      check("classID", "Class ID is required").not().isEmpty(),
      check("studentID", "Student ID is required").not().isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        return res.status(400).json({
          errors: errs.array(),
        });
      }
      //get these values from check auth (JWT)
      const email = req.user.email;
      const password = req.user.password;
      try {
        const data = {
          classID: req.body.classID,
          studentID: req.body.studentID,
        };

        const query = `CALL class_request_cancel (${data.classID}, ${data.studentID}, "${email}", "${password}")`;
        console.log(query);
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(201).json({
          status: "success",
          message: "Deleted Request",
        });
        // pool.query(query, (error, results) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     return res.status(201).json({
        //       status: "success",
        //       message: "Deleted Request",
        //     });
        //   }
        // });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

//accept class request
router
  .route("/student")
  .post(
    [check("classID", "A class ID is required").not().isEmpty()],
    checkAuth,
    async (req, res) => {
      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        console.log(errs);
        return res.status(400).json({
          errors: errs.array(),
        });
      }
      //get these values from check auth (JWT)
      const email = req.user.email;
      const password = req.user.password;
      try {
        const data = {
          classID: req.body.classID,
        };

        const query = `CALL class_request_accept ("${data.classID}", "${email}", "${password}")`;
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(201).json({
          status: "success",
          data: data,
          message: "sent request",
        });

        // pool.query(query, (error, results) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     return res.status(201).json({
        //       status: "success",
        //       data: data,
        //       message: "sent request",
        //     });
        //   }
        // });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

// decline class request
router
  .route("/student")
  .delete(
    [check("classID", "Class ID is required").not().isEmpty()],
    checkAuth,
    async (req, res) => {
      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        return res.status(400).json({
          errors: errs.array(),
        });
      }
      //get these values from check auth (JWT)
      const email = req.user.email;
      const password = req.user.password;
      try {
        const data = {
          classID: req.body.classID,
        };

        const query = `CALL class_request_decline (${data.classID}, "${email}", "${password}")`;
        console.log(query);
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(201).json({
          status: "success",
          message: "Deleted Request",
        });
        // pool.query(query, (error, results) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     return res.status(201).json({
        //       status: "success",
        //       message: "Deleted Request",
        //     });
        //   }
        // });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

module.exports = router;
