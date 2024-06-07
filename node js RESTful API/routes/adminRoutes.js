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
const { requiredXp } = require("../LevelSystem/Level");

router.route("/login").post(async (req, res) => {
  data = {
    email: req.body.email,
    password: req.body.password,
  };
  // get all students from database with corresponding email
  const query = `SELECT * FROM admins WHERE email = "${data.email}"`;
  const [results] = await pool.query(query).catch((err) => {
    // throw err;
    console.log("something went wrong");
    return res.status(400).json({ status: "failure", reason: err });
  });
  if (!results[0]) {
    // no students with that email
    return res.status(401).json({ status: "Email or Password incorrect" });
  } else {
    try {
      // compare input password with password on database
      if (await bcrypt.compare(req.body.password, results[0].Password)) {
        data.password = results[0].Password;
        // create jwt of email and password with a predefined expiry time
        const token = await JWT.sign({ data }, process.env.SECURE_KEY, {
          expiresIn: parseInt(process.env.EXPIRES_IN),
        });
        // return token
        return res.status(200).json({
          message: "Successfull login",
          token: token,
        });
      } else {
        return res.status(401).json({ status: "Email or Password incorrect" });
      }
    } catch {
      return res.status(404).json({ status: "error occured" });
    }
  }

  // pool.query(query, async (error, results) => {
  //   console.log(query);
  //   if (error) {
  //     return res.status(500).json({ status: "failure", reason: error.code });
  //   }
  //   if (!results[0]) {
  //     // no students with that email
  //     return res.status(401).json({ status: "Email or Password incorrect" });
  //   } else {
  //     try {
  //       // compare input password with password on database
  //       if (await bcrypt.compare(req.body.password, results[0].Password)) {
  //         data.password = results[0].Password;
  //         // create jwt of email and password with a predefined expiry time
  //         const token = await JWT.sign({ data }, process.env.SECURE_KEY, {
  //           expiresIn: parseInt(process.env.EXPIRES_IN),
  //         });
  //         // return token
  //         return res.status(200).json({
  //           message: "Successfull login",
  //           token: token,
  //         });
  //       } else {
  //         return res
  //           .status(401)
  //           .json({ status: "Email or Password incorrect" });
  //       }
  //     } catch {
  //       return res.status(404).json({ status: "error occured" });
  //     }
  //   }
  // });
});

//update admin , delete admin
router
  .route("/")
  .put(
    checkAuth, // <-- jwt middleware
    [
      check("email", "Invalid email").isEmail(),
      // check("password", "Password < 6").isLength({ min: 6 }),
      check("firstname", "First name is required").not().isEmpty(),
      check("lastname", "Last name is required").not().isEmpty(),
    ],
    async (req, res) => {
      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        return res.status(400).json({
          errors: errs.array(),
        });
      }
      //get these values from checkAuth (JWT)
      const oEmail = req.user.email;
      const oPassword = req.user.password;
      // new values
      const data = {
        email: req.body.email,
        fName: req.body.firstname,
        lName: req.body.lastname,
      };
      const query = `CALL Admin_edit ( "${oEmail}", "${oPassword}", "${data.email}", "${data.fName}", "${data.lName}")`;
      const [results] = await pool.query(query).catch((err) => {
        // throw err;
        console.log("something went wrong");
        return res.status(400).json({ status: "failure", reason: err });
      });
      return res.status(200).json({ status: "success", data: data });

      // pool.query(query, (error) => {
      //   if (error) {
      //     return res
      //       .status(400)
      //       .json({ status: "failure", reason: error.code });
      //   } else {
      //     return res.status(200).json({ status: "success", data: data });
      //   }
      // });
    }
  )
  .delete(checkAuth, async (req, res) => {
    //get these values from check auth (JWT)
    const oEmail = req.user.email;
    const oPassword = req.user.password;
    const query = `CALL Admin_delete ( "${oEmail}", "${oPassword}")`;
    const [results] = await pool.query(query).catch((err) => {
      // throw err;
      console.log("something went wrong");
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(200).json({
      status: "success",
      message: `deleted user: ${oEmail}`,
    });
    // pool.query(query, (error) => {
    //   if (error) {
    //     return res.status(400).json({ status: "failure", reason: error.code });
    //   } else {
    //     return res.status(200).json({
    //       status: "success",
    //       message: `deleted user: ${oEmail}`,
    //     });
    //   }
    // });
  });

//create admin
router
  .route("/create")
  .post(
    [
      check("email", "Invalid email").isEmail(),
      check("password", "Password < 6").isLength({ min: 6 }),
      check("firstname", "First name is required").not().isEmpty(),
      check("lastname", "Last name is required").not().isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      try {
        //validate inputs
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          return res.status(400).json({
            errors: errs.array(),
          });
        }
        const aEmail = req.user.email;
        const aPassword = req.user.password;

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
          email: req.body.email,
          fName: req.body.firstname,
          lName: req.body.lastname,
          password: hashedPassword,
        };
        const query = `CALL Admin_create ("${aEmail}","${aPassword}", "${data.email}", "${data.password}","${data.fName}", "${data.lName}")`;
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          console.log("something went wrong:", err);
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(201).json({ status: "success" });

        // pool.query(query, (error) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     return res.status(201).json({ status: "success" });
        //   }
        // });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

//change admin password
router
  .route("/password")
  .put(
    [
      check("oPassword", "Password < 6").isLength({ min: 6 }),
      check("nPassword", "Password < 6").isLength({ min: 6 }),
    ],
    checkAuth,
    async (req, res) => {
      try {
        //validate inputs
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          return res.status(400).json({
            errors: errs.array(),
          });
        }
        const aEmail = req.user.email;
        const aPassword = req.user.password;

        const hashedPassword = await bcrypt.hash(req.body.nPassword, 10);
        const data = {
          oldPassword: req.body.oPassword,
          newPassword: hashedPassword,
        };

        // get all students from database with corresponding email
        let query = `SELECT * FROM admins WHERE email = "${aEmail}"`;
        const [[result]] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });

        try {
          // compare input password with password on database
          if (await bcrypt.compare(data.oldPassword, result.Password)) {
            data.oldPassword = result.Password;
          } else {
            return res
              .status(401)
              .json({ status: "failure", message: "Password incorrect" });
          }
        } catch {
          return res.status(404).json({ status: "error occured" });
        }

        query = `CALL Admin_edit_password ("${aEmail}","${data.oldPassword}", "${data.newPassword}")`;
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          console.log("something went wrong");
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({ status: "success" });

        // pool.query(query, (error) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     return res.status(200).json({ status: "success" });
        //   }
        // });
      } catch (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    }
  );

//get admin details
router.route("/details").get(checkAuth, async (req, res) => {
  const email = req.user.email;
  const password = req.user.password;

  const query = `CALL Admin_details ("${email}", "${password}")`;
  const [results] = await pool.query(query).catch((err) => {
    // throw err;
    console.log("something went wrong");
    return res.status(400).json({ status: "failure", reason: err });
  });
  return res.status(200).json({ status: "success", data: results[0] });

  // pool.query(query, (error, results) => {
  //   if (results === null) {
  //     return res.status(204).json({ status: "Not found" });
  //   } else {
  //     return res.status(200).json({ status: "success", data: results[0] });
  //   }
  // });
});

module.exports = router;
