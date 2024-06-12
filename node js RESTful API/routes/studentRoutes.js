if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config({ path: "./.env" });
}

const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
// const pool = require('../db');
const checkAuth = require("../middleware/checkAuth");
const { check, validationResult } = require("express-validator");
const { requiredXp } = require("../LevelSystem/Level");

// router.route("/login").post(async (req, res) => {
  // data = {
  //   email: req.body.email,
  //   password: req.body.password,
  // };
  // // get all students from database with corresponding email
  // const query = `SELECT * FROM students WHERE email = "${data.email}"`;
  // const [results] = await pool.query(query).catch((err) => {
  //   // throw err;
  //   console.log("something went wrong");
  //   return res.status(400).json({ status: "failure", reason: err });
  // });
  // console.log(results);
  // // if (error) {
  // //   return res.status(500).json({ status: "failure", reason: error.code });
  // // }
  // if (!results[0]) {
  //   // no students with that email
  //   return res.status(401).json({ status: "Email or Password incorrect" });
  // } else {
  //   try {
  //     console.log("result found");
  //     // compare input password with password on database
  //     if (await bcrypt.compare(req.body.password, results[0].Password)) {
  //       console.log("doing bcrypt");
  //       data.password = results[0].Password;
  //       console.log("getting password");
  //       console.log(data);
  //       console.log("secure key: ", process.env.SECURE_KEY);
  //       // create jwt of email and password with a predefined expiry time
  //       const token = await JWT.sign({ data }, process.env.SECURE_KEY, {
  //         // expiresIn: parseInt(process.env.EXPIRES_IN),
  //       });
  //       console.log("this is token:", token);
  //       return res.status(200).json({
  //         status: "success",
  //         message: "Successfull login",
  //         token: token,
  //         // refreshToken: refreshToken,
  //       });
  //     } else {
  //       return res.status(401).json({ status: "Email or Password incorrect" });
  //     }
  //   } catch {
  //     return res.status(404).json({ status: "error occured" });
  //   }
  // }
  router.post('/login', async (req, res) => {
    
    try {
      const { email, password } = req.body;
      console.log("Login attempt with email:", email);
    console.log("SECURE_KEY:", process.env.SECURE_KEY); // Log the SECURE_KEY
      // // Get all students from the database with the corresponding email
      // const [results] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);

          // Query to find the student with the provided email
    const query = `SELECT * FROM students WHERE email = ?`;
    const results = await pool.query(query, email);


  
      // If no students found with that email
      if (results.length === 0) {
        return res.status(401).json({ status: 'failure', message: 'Email or Password incorrect' });
      }
  
      const user = results[0];
      console.log("User found:", user);
  
      // Compare input password with password in the database
      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) {
        console.log("Password mismatch for user:", email);
        return res.status(401).json({ status: 'failure', message: 'Email or Password incorrect' });
      }
  
      console.log("Password matched for user:", email);

      // Create JWT of email and password with a predefined expiry time
      const token = JWT.sign({ data: { email: user.Email, id: user.StudentID } }, process.env.SECURE_KEY, {
      expiresIn: parseInt(process.env.EXPIRES_IN),
    });

    console.log("Generated token for user:", token);
  
      return res.status(200).json({
        status: 'success',
        message: 'Successful login',
        token: token,
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }

});

// update student , delete student
router
  .route("/")
  .put(
 // <-- jwt middleware
 checkAuth,
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
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      // new values
      const data = {
        email: req.body.email,
        fName: req.body.firstname,
        lName: req.body.lastname,
        password: hashedPassword,
      };
      const query = `CALL update_student ( "${oEmail}", "${oPassword}", "${data.fName}", "${data.lName}", "${data.email}")`;
      const result = await pool.query(query).catch((err) => {
        // throw err;
        return res.status(400).json({ status: "failure", reason: err });
      });
      return res.status(200).json({ status: "success", data: result });
    }
  )
  .delete(checkAuth, async (req, res) => {
    //get these values from check auth (JWT)
    const oEmail = req.user.email;
    const oPassword = req.user.password;
    const query = `CALL delete_student ( "${oEmail}", "${oPassword}")`;
    const result = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(200).json({
      status: "success",
      message: `deleted user: ${oEmail}`,
    });
    
  });

// router.route('/')
//   .put(checkAuth, (req, res) => {
//     res.send('Authenticated!');
//   });

//update profile picture
router
  .route("/profilePic")
  .put(
    checkAuth,
    [
      check("ProfilePicture", "Profile picture url is required")
        .not()
        .isEmpty(),
    ],
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
      // new values
      const data = {
        profilePicture: req.body.ProfilePicture,
      };
      const query = `CALL update_profile_picture ("${data.profilePicture}", "${email}", "${password}")`;
      console.log(query);
      const result = await pool.query(query).catch((err) => {
        // throw err;
        return res.status(400).json({ status: "failure", reason: err });
      });
      return res.status(200).json({ status: "success", data: data });
    }
  );

//update banner
router
  .route("/banner")
  .put(
    checkAuth,
    [check("Banner", "Banner url is required").not().isEmpty()],
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
      // new values
      const data = {
        banner: req.body.Banner,
      };
      const query = `CALL update_banner ("${data.banner}", "${email}", "${password}")`;
      console.log(query);

      const result = await pool.query(query).catch((err) => {
        // throw err;
        return res.status(400).json({ status: "failure", reason: err });
      });
      return res.status(200).json({ status: "success", data: data });
    }
  );

//create student
router
  .route("/create")
  .post(
    [
      check("email", "Invalid email").isEmail(),
      check("password", "Password < 6").isLength({ min: 6 }),
      check("firstname", "First name is required").not().isEmpty(),
      check("lastname", "Last name is required").not().isEmpty(),
    ],
    async (req, res) => {
      try {
        // Validate inputs
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
          email: req.body.email,
          fName: req.body.firstname,
          lName: req.body.lastname,
          password: hashedPassword,
        };
        const query = `CALL create_student ("${data.fName}", "${data.lName}", "${data.email}", "${data.password}")`;
        console.log(query);

        // Execute the query and handle potential errors
        try {
          await pool.query(query);
          return res.status(201).json({ status: "success" });
        } catch (queryError) {
          console.error(queryError); // Log the error for debugging
          return res.status(400).json({ status: "failure", reason: queryError });
        }
        
      } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).send(err);
      }
    }
  );

//get students by class
router
  .route("/class")
  .post(
    checkAuth,
    [check("classID", "ClassID is required").not().isEmpty()],
   
    async (req, res) => {
      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        return res.status(400).json({
          errors: errs.array(),
        });
      }

      const email = req.user.email;
      const password = req.user.password;
      const data = {
        classID: req.body.classID,
      };
      const query = `CALL get_students_by_class (${data.classID}, "${email}", "${password}")`;
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

      
    }
  );

//get students details
router.route("/details").get(checkAuth, async (req, res) => {
  try {
    const email = req.user.email;
  
    const query = `CALL get_student_details ("${email}", "${password}")`;
    console.log(query);

    const [[[results]]] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    console.log(results);

    if (results === null) {
      return res.status(204).json({ status: "Not found" });
    } else {
      //get required xp for next level
      results.RequiredXp = requiredXp(results.Level);
      return res.status(200).json({ status: "success", data: results });
    }
  } catch (err) {
    return res.status(500).json({ status: "Not found", err });
  }
});

router
  .route("/update/password")
  .put(
    checkAuth,
    [
      check("oPassword", "Password < 6").isLength({ min: 6 }),
      check("nPassword", "Password < 6").isLength({ min: 6 }),
    ],
   
    async (req, res) => {
      try {
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          return res.status(400).json({
            errors: errs.array(),
          });
        }
        //get these values from check auth (JWT)
        const sEmail = req.user.email;
        const tPassword = req.user.password;

        const hashedPassword = await bcrypt.hash(req.body.nPassword, 10);
        const data = {
          oldPassword: req.body.oPassword,
          newPassword: hashedPassword,
        };

        // get all students from database with corresponding email
        let query = `SELECT * FROM students WHERE email = "${sEmail}"`;

        const [[result]] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        console.log(result);
        try {
          // compare input password with password on database
          if (await bcrypt.compare(data.oldPassword, result.Password)) {
            data.oldPassword = result.Password;
          } else {
            return res.status(401).json({ status: "Password incorrect" });
          }
        } catch {
          return res.status(404).json({ status: "error occured" });
        }

        query = `CALL student_edit_password ("${sEmail}","${data.oldPassword}", "${data.newPassword}")`;
        await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({ status: "success" });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );


module.exports = router;
