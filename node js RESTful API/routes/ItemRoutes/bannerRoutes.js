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

    const query = `CALL Banners_get_all ("${email}", "${password}")`;

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

// get banner details
router.route("/details").get(async (req, res) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      console.log(errs);
      return res.status(400).json({
        errors: errs.array(),
      });
    }
    const themeID = req.query.ThemeID;

    const query = `CALL Banners_get_details (${themeID})`;

    const [theme] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    console.log(theme);
    return res.status(200).json({
      status: "success",
      data: theme[0],
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

// get all purchased themes
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

    const query = `CALL Banners_purchased ("${email}", "${password}")`;

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

// purchase a banner
router
  .route("/purchased")
  .post(
    [check("BannerID", "A BannerID is required").not().isEmpty()],
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
          bannerID: req.body.BannerID,
        };

        const query = `CALL Banners_purchased_add (${data.bannerID},"${email}", "${password}")`;
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

// get all banners admin
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

    const query = `CALL Banners_get_all_admin ("${email}", "${password}")`;

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

// delete themes admin
router
  .route("/admin")
  .delete(
    [check("BannerID", "A BannerID is required").not().isEmpty()],
    checkAuth,
    async (req, res) => {
      try {
        const email = req.user.email;
        const password = req.user.password;

        const bannerID = req.body.BannerID;

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        const query = `CALL Banners_delete ("${email}", "${password}", ${bannerID})`;

        const [themes] = await pool.query(query).catch((err) => {
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
    }
  );

// edit banners admin
router
  .route("/admin")
  .put(
    [
      check("BannerID", "A BannerID is required").not().isEmpty(),
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

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        const data = {
          bannerID: req.body.BannerID,
          name: req.body.Name,
          details: req.body.Details,
          image: req.body.Image,
          cost: req.body.Cost,
          requiredLevel: req.body.RequiredLevel,
        };

        const query = `CALL Banners_edit ("${email}", "${password}", ${data.bannerID}, "${data.name}", "${data.details}", "${data.image}", "${data.cost}", "${data.requiredLevel}")`;
        const banners = await pool.query(query).catch((err) => {
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
    }
  );

// add banners admin
router
  .route("/admin")
  .post(
    [
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

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        const data = {
          name: req.body.Name,
          details: req.body.Details,
          image: req.body.Image,
          cost: req.body.Cost,
          requiredLevel: req.body.RequiredLevel,
        };

        const query = `CALL Banners_add ("${email}", "${password}", "${data.name}", "${data.details}", "${data.image}", "${data.cost}", "${data.requiredLevel}")`;
        const banners = await pool.query(query).catch((err) => {
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
    }
  );

module.exports = router;
