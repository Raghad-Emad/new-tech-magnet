if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config({ path: "./.env" });
}

const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const JWT = require("jsonwebtoken");
const checkAuth = require("../middleware/checkAuth");

//get the students classes
router.route("/student").get(checkAuth, async (req, res) => {
  const email = req.user.email;
  const password = req.user.password;

  const query = `CALL get_students_classes ("${email}", "${password}")`;
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
});

// Get teachers classes
router.route("/teacher").get(checkAuth, async (req, res) => {
  //get these values from check auth (JWT)
  const email = req.user.email;
  const password = req.user.password;

  const query = `CALL get_classes_by_teacher ("${email}", "${password}")`;
  console.log(query);
  const [results] = await pool.query(query).catch((err) => {
    // throw err;
    return res.status(400).json({ status: "failure", reason: err });
  });
  if (results === null) {
    return res.status(204).json({ status: "Not found" });
  } else {
    return res.status(200).json({ status: "success", data: results[0] });
  }

  // pool.query(query, (error, results) => {
  //   if (error) {
  //     return res.status(400).json({ status: "failure", reason: error.code });
  //   } else {
  //     if (results === null) {
  //       return res.status(204).json({ status: "Not found" });
  //     } else {
  //       return res.status(200).json({ status: "success", data: results[0] });
  //     }
  //   }
  // });
});

//create class
router
  .route("/")
  .post(
    [
      check("name", "A class name is required").not().isEmpty(),
      check("year", "A year group is required").not().isEmpty(),
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
          name: req.body.name,
          yGroup: req.body.year,
        };

        const query = `CALL create_class ("${data.name}", ${data.yGroup}, "${email}", "${password}")`;
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(201).json({
          status: "success",
          data: data,
          message: "created class",
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
        //       message: "created class",
        //     });
        //   }
        // });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

//update class
router
  .route("/")
  .put(
    [
      check("classID", "Class ID is required").not().isEmpty(),
      check("name", "A class name is required").not().isEmpty(),
      check("year", "A year group is required").not().isEmpty(),
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
          name: req.body.name,
          yGroup: req.body.year,
        };

        const query = `CALL update_class (${data.classID},"${data.name}", ${data.yGroup}, "${email}", "${password}")`;
        console.log(query);
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(201).json({
          status: "success",
          data: data,
          message: "created class",
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
        //       message: "created class",
        //     });
        //   }
        // });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

// delete class
router
  .route("/")
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

        const query = `CALL delete_class (${data.classID}, "${email}", "${password}")`;
        console.log(query);
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(201).json({
          status: "success",
          message: "Class successfully deleted",
        });

        // pool.query(query, (error, results) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     return res.status(201).json({
        //       status: "success",
        //       message: "Class successfully deleted",
        //     });
        //   }
        // });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

module.exports = router;
