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

    const query = `CALL Themes_get_all ("${email}", "${password}")`;

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

// get theme details
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

    const query = `CALL Themes_details (${themeID})`;

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

    const query = `CALL Themes_get_all_admin ("${email}", "${password}")`;

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

    const query = `CALL Themes_purchased ("${email}", "${password}")`;

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

// purchase a theme
router
  .route("/purchased")
  .post(
    [check("ThemeID", "A ThemeID is required").not().isEmpty()],
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
          themeID: req.body.ThemeID,
        };

        const query = `CALL Themes_purchased_add (${data.themeID},"${email}", "${password}")`;
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

// admin delete theme
router
  .route("/admin")
  .delete(
    [check("ThemeID", "A ThemeID is required").not().isEmpty()],
    checkAuth,
    async (req, res) => {
      try {
        const email = req.user.email;
        const password = req.user.password;

        const themeID = req.body.ThemeID;

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        const query = `CALL Themes_delete ("${email}", "${password}",${themeID})`;
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

// admin add theme
router.route("/admin").post(
  [
    // check("ThemeID", "A ThemeID is required").not().isEmpty(),
    check("Name", "A Name is required").not().isEmpty(),
    check("Details", "A Details is required").not().isEmpty(),
    check("PrimaryColor", "A PrimaryColor is required").not().isEmpty(),
    check("BackgroundColor", "A BackgroundColor is required").not().isEmpty(),
    check("BtnTextColor", "A BtnTextColor is required").not().isEmpty(),
    check("IsDark", "A IsDark is required").not().isEmpty(),
    check("Cost", "A Cost is required").not().isEmpty(),
    check("ReqLevel", "A ReqLevel is required").not().isEmpty(),
  ],
  checkAuth,
  async (req, res) => {
    try {
      const email = req.user.email;
      const password = req.user.password;

      const data = {
        // themeID: req.body.ThemeID,
        name: req.body.Name,
        details: req.body.Details,
        primaryColor: req.body.PrimaryColor,
        backgroundColor: req.body.BackgroundColor,
        btnTextColor: req.body.BtnTextColor,
        isDark: req.body.IsDark,
        cost: req.body.Cost,
        reqLevel: req.body.ReqLevel,
      };

      const errs = validationResult(req);
      if (!errs.isEmpty()) {
        console.log(errs);
        return res.status(400).json({
          errors: errs.array(),
        });
      }

      // const query = `CALL Themes_delete ("${email}", "${password}",${themeID})`;
      // const query = `CALL Themes_add (${data.themeID}, "${data.name}", "${data.details}", "${data.primaryColor}", "${data.backgroundColor}", "${data.isDark}", ${data.cost}, ${data.reqLevel})`;
      const query = `CALL Themes_add ("${email}","${password}","${data.name}", "${data.details}", "${data.primaryColor}", "${data.backgroundColor}", "${data.btnTextColor}","${data.isDark}", ${data.cost}, ${data.reqLevel})`;

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

// admin edit theme
router
  .route("/admin")
  .put(
    [
      check("ThemeID", "A ThemeID is required").not().isEmpty(),
      check("Name", "A Name is required").not().isEmpty(),
      check("Details", "A Details is required").not().isEmpty(),
      check("PrimaryColor", "A PrimaryColor is required").not().isEmpty(),
      check("BackgroundColor", "A BackgroundColor is required").not().isEmpty(),
      check("BtnTextColor", "A BtnTextColor is required").not().isEmpty(),
      check("IsDark", "A IsDark is required").not().isEmpty(),
      check("Cost", "A Cost is required").not().isEmpty(),
      check("ReqLevel", "A ReqLevel is required").not().isEmpty(),
    ],
    checkAuth,
    async (req, res) => {
      try {
        const email = req.user.email;
        const password = req.user.password;

        const data = {
          themeID: req.body.ThemeID,
          name: req.body.Name,
          details: req.body.Details,
          primaryColor: req.body.PrimaryColor,
          backgroundColor: req.body.BackgroundColor,
          btnTextColor: req.body.BtnTextColor,
          isDark: req.body.IsDark,
          cost: req.body.Cost,
          reqLevel: req.body.ReqLevel,
        };

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }

        // const query = `CALL Themes_delete ("${email}", "${password}",${themeID})`;
        // const query = `CALL Themes_add (${data.themeID}, "${data.name}", "${data.details}", "${data.primaryColor}", "${data.backgroundColor}", "${data.isDark}", ${data.cost}, ${data.reqLevel})`;
        const query = `CALL Themes_edit ("${email}","${password}",${data.themeID},"${data.name}", "${data.details}", "${data.primaryColor}", "${data.backgroundColor}", "${data.btnTextColor}","${data.isDark}", ${data.cost}, ${data.reqLevel})`;

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

module.exports = router;
