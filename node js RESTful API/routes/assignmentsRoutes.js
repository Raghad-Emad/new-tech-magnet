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

// create quiz assignment for class
router
  .route("/quiz/class")
  .post(
    [
      check("classID", "Invalid class ID").not().isEmpty(),
      check("xp", "Invalid xp").not().isEmpty(),
      check("coins", "Invalid coins").not().isEmpty(),
      check("quizID", "Invalid quiz ID").not().isEmpty(),
      check("dueDate", "Invalid Date").isISO8601(),
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

        data = {
          classID: req.body.classID,
          quizID: req.body.quizID,
          dueDate: req.body.dueDate,
          xp: req.body.xp,
          coins: req.body.coins,
        };
        console.log(data);

        //assign activity to class
        let query = `CALL assignment_quiz_create_class (${data.classID},${data.quizID},"${data.dueDate}", ${data.xp}, ${data.coins}, "${email}", "${password}")`;
        console.log(query);
        await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });

        // //get students from class
        // let query = `CALL teacher_get_students_by_class ("${data.classID}", "${email}", "${password}")`;
        // const [users] = await pool.query(query).catch((err) => {
        //   // throw err;
        //   return res.status(400).json({ status: "failure", reason: err });
        // });
        // console.log(users);
        // await users.map(async (user) => {
        //   // assign students to class
        //   let query = `CALL assignment_quiz_create (${user.StudentID},${data.quizID},"${email}","${password}")`;
        //   console.log(query);
        //   await pool.query(query).catch((err) => {
        //     // throw err;
        //     return res.status(400).json({ status: "failure", reason: err });
        //   });
        // });

        return res.status(200).json({
          status: "success",
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

// create quiz assignment for indivisual student
router
  .route("/quiz")
  .post(
    [
      check("StudentID", "Invalid student ID").not().isEmpty(),
      check("QuizID", "Invalid quiz ID").not().isEmpty(),
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

        data = {
          studentID: req.body.studentID,
          quizID: req.body.quizID,
        };

        let query = `CALL assignment_quiz_create (${data.studentID},${data.quizID},"${email}","${password}")`;
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

// delete quiz assignment
router
  .route("/quiz/class")
  .delete(
    [
      check("classID", "Invalid class ID").not().isEmpty(),
      check("quizID", "Invalid quiz ID").not().isEmpty(),
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
        console.log("testing testing");

        data = {
          classID: req.body.classID,
          quizID: req.body.quizID,
        };

        let query = `CALL assignment_quiz_delete (${data.quizID},${data.classID},"${email}","${password}")`;
        console.log(query);
        const result = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        // console.log(results);
        return res.status(200).json({
          status: "success",
          result,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

// get students assignments
router.route("/quizzes").get(checkAuth, async (req, res) => {
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

    let query = `CALL assignments_by_students("${email}","${password}")`;
    const [[quizzes]] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(200).json({
      status: "success",
      quizzes,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// get class assignments progress
router
  .route("/progress")
  .get(
    [check("classID", "Invalid class ID").not().isEmpty()],
    checkAuth,
    async (req, res) => {
      // try {
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
        classID: req.query.classID,
      };
      let query = `CALL assignment_overall_class_progress(${data.classID},"${email}","${password}")`;
      console.log(query);
      const [[progress]] = await pool.query(query).catch((err) => {
        // throw err;
        return res.status(400).json({ status: "failure", reason: err });
      });
      console.log(progress);
      return res.status(200).json({
        status: "success",
        data: progress,
      });
      // } catch (err) {
      //   return res.status(500).send(err);
      // }
    }
  );

// get all quiz submissions
router
  .route("/submissions")
  .get(
    [
      check("classID", "Invalid class ID").not().isEmpty(),
      check("quizID", "Invalid quiz ID").not().isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      try {
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;
        const classID = req.query.classID;
        const quizID = req.query.quizID;
        const query = `CALL quiz_submission_get_by_assignment (${quizID},${classID},"${email}", "${password}")`;
        console.log(query);
        const [[submissions]] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({
          status: "success",
          data: submissions,
        });
      } catch (err) {}
    }
  );

module.exports = router;
