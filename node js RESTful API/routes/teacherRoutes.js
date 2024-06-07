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

router.route("/").get(checkAuth, async (req, res) => {
  //get these values from check auth (JWT)
  const email = req.user.email;
  const password = req.user.password;

  const query = `CALL details_teacher("${email}", "${password}")`;
  const [[[details]]] = await pool.query(query).catch((err) => {
    // throw err;
    return res.status(400).json({ status: "failure", reason: err });
  });
  // console.log(results);
  return res.status(200).json({
    status: "success",
    details,
  });
  // pool.query(query, (results, error) => {
  //   if (error) {
  //     res.status(400).json({ status: "failure", reason: error.code });
  //   } else {
  //     res.status(200).json({
  //       status: "success",
  //       data: results,
  //     });
  //   }
  // }

  // );
});

router.route("/login").post(async (req, res) => {
  data = {
    email: req.body.email,
    password: req.body.password,
  };
  // const query = "SELECT * FROM teachers WHERE email = ?";
  const query = `SELECT * FROM teachers WHERE email = "${data.email}"`;
  const [results] = await pool.query(query).catch((err) => {
    // throw err;
    console.log("something went wrong");
    return res.status(400).json({ status: "failure", reason: err });
  });
  if (!results[0]) {
    return res.status(401).json({ status: "Email not found" });
  } else {
    try {
      if (await bcrypt.compare(req.body.password, results[0].Password)) {
        data.password = results[0].Password;
        const token = await JWT.sign({ data }, process.env.SECURE_KEY, {
          expiresIn: parseInt(process.env.EXPIRES_IN),
        });
        return res.status(200).json({
          status: "success",
          message: "Successfull login",
          token: token,
        });
      } else {
        return res.status(401).json({ status: "Password not matching" });
      }
    } catch {
      return res.status(404).json({ status: "error occured" });
    }
  }
  // pool.query(query, [req.body.email], async (error, results) => {
  //   if (error) {
  //     return res.status(500).json({ status: "failure", reason: error.code });
  //   }
  //   if (!results[0]) {
  //     return res.status(401).json({ status: "Email not found" });
  //   } else {
  //     try {
  //       if (await bcrypt.compare(req.body.password, results[0].Password)) {
  //         data.password = results[0].Password;
  //         const token = await JWT.sign({ data }, process.env.SECURE_KEY, {
  //           expiresIn: parseInt(process.env.EXPIRES_IN),
  //         });
  //         return res.status(200).json({
  //           status: "success",
  //           message: "Successfull login",
  //           token: token,
  //         });
  //       } else {
  //         return res.status(401).json({ status: "Password not matching" });
  //       }
  //     } catch {
  //       return res.status(404).json({ status: "error occured" });
  //     }
  //   }
  // });
});

router
  .route("/update")
  .put(
    [
      check("email", "Invalid email").isEmail(),
      check("firstname", "First name is required").not().isEmpty(),
      check("lastname", "Last name is required").not().isEmpty(),
      check("phonenumber", "Phone number is required").not().isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      //get these values from check auth (JWT)
      const oEmail = req.user.email;
      const oPassword = req.user.password;
      // new values
      const data = {
        email: req.body.email,
        fName: req.body.firstname,
        lName: req.body.lastname,
        phonenumber: req.body.phonenumber,
        // password: req.body.password,
      };
      // const query = `UPDATE teachers SET Email = '${data.email}', Name = '${data.email}',Password = '${data.password}' WHERE id = ${req.params.id}`;
      const query = `CALL update_teacher ( "${oEmail}", "${oPassword}", "${data.fName}", "${data.lName}", "${data.email}","${data.phonenumber}")`;
      console.log(query);
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
    const email = req.user.email;
    const password = req.user.password;

    const query = `CALL delete_teacher ( "${email}", "${password}")`;
    const [results] = await pool.query(query).catch((err) => {
      // throw err;
      console.log("something went wrong");
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(200).json({
      status: "success",
      message: `deleted user: ${req.params.id}`,
    });
    // pool.query(query, (error) => {
    //   if (error) {
    //     return res.status(400).json({ status: "failure", reason: error.code });
    //   } else {
    //     return res.status(200).json({
    //       status: "success",
    //       message: `deleted user: ${req.params.id}`,
    //     });
    //   }
    // });
  });

router
  .route("/update/password")
  .put(
    [
      check("oPassword", "Password < 6").isLength({ min: 6 }),
      check("nPassword", "Password < 6").isLength({ min: 6 }),
    ],
    checkAuth,
    async (req, res) => {
      try {
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          return res.status(400).json({
            errors: errs.array(),
          });
        }
        //get these values from check auth (JWT)
        const tEmail = req.user.email;
        const tPassword = req.user.password;

        const hashedPassword = await bcrypt.hash(req.body.nPassword, 10);
        const data = {
          oldPassword: req.body.oPassword,
          newPassword: hashedPassword,
        };

        // get all students from database with corresponding email
        let query = `SELECT * FROM teachers WHERE email = "${tEmail}"`;
        console.log(query);
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
            return res.status(401).json({ status: " Password incorrect" });
          }
        } catch {
          return res.status(404).json({ status: "error occured" });
        }

        query = `CALL teacher_edit_password ("${tEmail}","${data.oldPassword}", "${data.newPassword}")`;
        const [result2] = await pool.query(query).catch((err) => {
          // throw err;
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
        return res.status(500).send(err);
      }
    }
  );

//create teacher
router
  .route("/create")
  .post(
    [
      check("email", "Invalid email").isEmail(),
      check("password", "Password < 6").isLength({ min: 6 }),
      check("firstname", "First name is required").not().isEmpty(),
      check("lastname", "Last name is required").not().isEmpty(),
      check("phonenumber", "Phone number is required").not().isEmpty(),
    ],
    async (req, res) => {
      try {
        //validate inputs
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
          firstName: req.body.firstname,
          lastName: req.body.lastname,
          password: hashedPassword,
          phoneNumber: req.body.phonenumber,
        };
        email = data.email;

        const query = `CALL create_teacher ("${data.firstName}", "${data.lastName}", "${data.email}", "${data.password}","${data.phoneNumber}")`;
        console.log(query);
        const [result] = await pool.query(query).catch((err) => {
          // throw err;
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

// assign student to class
router.route("/classes/assign").post(checkAuth, async (req, res) => {
  //get these values from check auth (JWT)
  const email = req.user.email;
  const password = req.user.password;
  try {
    const data = {
      classID: req.body.classID,
      studentID: req.body.studentID,
    };

    const query = `CALL add_student_to_class (${data.classID}, ${data.studentID}, "${email}", "${password}")`;
    const [result] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(201).json({
      status: "success",
      data: data,
      message: "student added to class",
    });
    // pool.query(query, (error, results) => {
    //   if (error) {
    //     return res.status(400).json({ status: "failure", reason: error.code });
    //   } else {
    //     return res.status(201).json({
    //       status: "success",
    //       data: data,
    //       message: "student added to class",
    //     });
    //   }
    // });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// remove student from class
router.route("/classes/remove").delete(checkAuth, async (req, res) => {
  //get these values from check auth (JWT)
  const email = req.user.email;
  const password = req.user.password;
  try {
    const data = {
      classID: req.body.classID,
      studentID: req.body.studentID,
    };

    const query = `CALL remove_student_from_class (${data.classID}, ${data.studentID}, "${email}", "${password}")`;
    const [results] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(201).json({
      status: "success",
      data: data,
      message: "student added to class",
    });
    // pool.query(query, (error, results) => {
    //   if (error) {
    //     return res.status(400).json({ status: "failure", reason: error.code });
    //   } else {
    //     return res.status(201).json({
    //       status: "success",
    //       data: data,
    //       message: "student added to class",
    //     });
    //   }
    // });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// get all students
router.route("/students/all").get(checkAuth, async (req, res) => {
  try {
    //get these values from check auth (JWT)
    const email = req.user.email;
    const password = req.user.password;
    const query = `CALL get_all_students ("${email}", "${password}")`;

    const [students] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(200).json({
      status: "success",
      students,
    });
  } catch (err) {}
});

// Search students
router.route("/search").post(checkAuth, async (req, res) => {
  //get these values from check auth (JWT)
  const email = req.user.email;
  const password = req.user.password;
  try {
    const data = {
      sTerm: req.body.searchTerm,
    };

    const query = `CALL search_students ("${email}", "${password}", "${data.sTerm}")`;
    const [students] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(200).json({
      status: "success",
      students,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

//get students by class
router
  .route("/class")
  .post(
    [check("classID", "ClassID is required").not().isEmpty()],
    checkAuth,
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

      const query = `CALL teacher_get_students_by_class (${data.classID}, "${email}", "${password}")`;
      const [results] = await pool.query(query).catch((err) => {
        // throw err;
        return res.status(400).json({ status: "failure", reason: err });
      });
      if (results === null) {
        return res.status(204).json({ status: "Not found" });
      } else {
        console.log(results[0]);
        return res.status(200).json({ status: "success", data: results[0] });
      }
      // pool.query(query, (error, results) => {
      //   if (results === null) {
      //     return res.status(204).json({ status: "Not found" });
      //   } else {
      //     console.log(results[0]);
      //     return res.status(200).json({ status: "success", data: results[0] });
      //   }
      // });
    }
  );

module.exports = router;
