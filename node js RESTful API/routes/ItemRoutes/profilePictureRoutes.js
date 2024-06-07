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

// get all themes
router.route("/").get(checkAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const password = req.user.password;

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      console.log(errs);
      return res.status(400).json({
        errors: errs.array(),
      });
    }

    const query = `CALL ProfilePic_get_all ("${email}", "${password}")`;

    const [[themes]] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    // console.log(results);
    return res.status(200).json({
      status: "success",
      data: themes,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// get all themes admin
router.route("/admin").get(checkAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const password = req.user.password;

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      console.log(errs);
      return res.status(400).json({
        errors: errs.array(),
      });
    }

    const query = `CALL ProfilePic_get_all_admin ("${email}", "${password}")`;

    const [[themes]] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    // console.log(results);
    return res.status(200).json({
      status: "success",
      data: themes,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// get all purchased profile pics
router.route("/purchased").get(checkAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const password = req.user.password;

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      console.log(errs);
      return res.status(400).json({
        errors: errs.array(),
      });
    }

    const query = `CALL ProfilePic_purchased ("${email}", "${password}")`;

    const [[banners]] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    // console.log(results);
    return res.status(200).json({
      status: "success",
      data: banners,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// purchase a profile picture
router
  .route("/purchased")
  .post(
    [
      check("ProfilePictureID", "A ProfilePictureID is required")
        .not()
        .isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      try {
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }
        const email = req.user.email;
        const password = req.user.password;
        const data = {
          profilePictureID: req.body.ProfilePictureID,
        };

        const query = `CALL ProfilePic_purchased_add (${data.profilePictureID},"${email}", "${password}")`;
        console.log(query);
        const [results] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        console.log("results", results);

        return res.status(200).json({
          status: "success",
          results,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

// admin delete profile
router
  .route("/admin")
  .delete(
    [check("ProfilePicID", "A ProfilePicID is required").not().isEmpty()],
    checkAuth,
    async (req, res) => {
      try {
        const email = req.user.email;
        const password = req.user.password;

        console.log(req.body.ProfilePicID);
        const profilePicID = req.body.ProfilePicID;

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        const query = `CALL ProfilePic_delete ("${email}", "${password}",${profilePicID})`;
        console.log(query);

        const results = await pool.query(query).catch((err) => {
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

// admin edit profile pic
router
  .route("/admin")
  .put(
    [
      check("ProfilePicID", "A ProfilePicID is required").not().isEmpty(),
      check("Name", "A Name is required").not().isEmpty(),
      check("Details", "A Details is required").not().isEmpty(),
      check("Image", "A Image is required").not().isEmpty(),
      check("Cost", "A Cost is required").not().isEmpty(),
      check("RequiredLevel", "A Required Level is required").not().isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      try {
        const email = req.user.email;
        const password = req.user.password;
        const data = {
          ProfilePicID: req.body.ProfilePicID,
          name: req.body.Name,
          details: req.body.Details,
          image: req.body.Image,
          cost: req.body.Cost,
          requiredLevel: req.body.RequiredLevel,
        };

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        // const query = `CALL ProfilePic_edit ("${email}","${password}",${data.profilePicID},"${data.name}", "${data.details}", "${data.primaryColor}", "${data.backgroundColor}", "${data.btnTextColor}","${data.isDark}", ${data.cost}, ${data.reqLevel})`;
        const query = `CALL ProfilePic_edit ("${email}", "${password}", ${data.ProfilePicID}, "${data.name}", "${data.details}", "${data.image}", "${data.cost}", "${data.requiredLevel}")`;
        console.log(query);
        const results = await pool.query(query).catch((err) => {
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

// admin add profile pic
router
  .route("/admin")
  .post(
    [
      check("Name", "A Name is required").not().isEmpty(),
      check("Details", "Details is required").not().isEmpty(),
      check("Image", "An Image is required").not().isEmpty(),
      check("Cost", "Cost is required").not().isEmpty(),
      check("RequiredLevel", "Required Level is required").not().isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      try {
        const email = req.user.email;
        const password = req.user.password;
        const data = {
          name: req.body.Name,
          details: req.body.Details,
          image: req.body.Image,
          cost: req.body.Cost,
          requiredLevel: req.body.RequiredLevel,
        };

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        const query = `CALL ProfilePic_add ("${email}", "${password}", "${data.name}", "${data.details}", "${data.image}", "${data.cost}", "${data.requiredLevel}")`;
        console.log(query);
        const results = await pool.query(query).catch((err) => {
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

// get profile pic details
router.route("/details").get(async (req, res) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      console.log(errs);
      return res.status(400).json({
        errors: errs.array(),
      });
    }
    const profilePicID = req.query.ProfilePicID;

    // const query = `CALL ProfilePic_get_details (${profilePicID})`;
    const query = `CALL ProfilePic_get_details (${profilePicID})`;

    const [profilePics] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(200).json({
      status: "success",
      data: profilePics[0],
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
