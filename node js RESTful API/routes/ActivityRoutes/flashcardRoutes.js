if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config({ path: "./.env" });
}

const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const { check, validationResult, oneOf } = require("express-validator");
const JWT = require("jsonwebtoken");
const checkAuth = require("../../middleware/checkAuth");

// view all decks
router.route("/view").get(checkAuth, async (req, res) => {
  try {
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

    const query = `CALL deck_get ("${email}", "${password}")`;
    const [[decks]] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(200).json({
      status: "success",
      decks,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});
//create Deck
router
  .route("/create")
  .post(
    [check("Name", "Invalid Name").not().isEmpty()],
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
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        const data = {
          name: req.body.Name,
        };
        const query = `CALL deck_create ("${data.name}", "${email}", "${password}")`;
        const results = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({
          status: "success",
          results,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );
//delete Deck
router
  .route("/delete")
  .delete(
    [check("DeckID", "Invalid DeckID").not().isEmpty()],
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
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        const data = {
          deckID: req.body.DeckID,
        };
        const query = `CALL deck_delete ("${data.deckID}", "${email}", "${password}")`;
        const results = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({
          status: "success",
          results,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );
//update Deck
router
  .route("/update")
  .put(
    [
      check("Name", "Invalid Name").not().isEmpty(),
      check("DeckID", "Invalid DeckID").not().isEmpty(),
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
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        const data = {
          name: req.body.Name,
          deckID: req.body.DeckID,
        };
        const query = `CALL deck_update ("${data.deckID}","${data.name}", "${email}", "${password}")`;
        console.log(query);
        const results = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({
          status: "success",
          results,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

//////////////////
//              //
//  Flashcards  //
//              //
//////////////////

// view flash cards from deck
router
  .route("/flashcards")
  .get(
    [check("DeckID", "Invalid DeckID").not().isEmpty()],
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
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        console.log(req.query.DeckID);
        const data = {
          deckID: req.query.DeckID,
          //   req.params.id
        };
        console.log(data);
        const query = `CALL flashcard_get_all_by_deck ("${data.deckID}","${email}", "${password}")`;
        console.log(query);
        const [[flashCards]] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        console.log(flashCards);
        return res.status(200).json({
          status: "success",
          flashCards,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

//get number of flashcards in deck
router
  .route("/num")
  .get(
    [check("DeckID", "Invalid DeckID").not().isEmpty()],
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
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        const data = {
          deckID: req.query.DeckID,
        };

        const query = `CALL deck_num_flashcards ("${data.deckID}","${email}", "${password}")`;
        const [[[numCards]]] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        console.log(numCards);
        // console.log(numCards[0]);
        return res.status(200).json({
          status: "success",
          numCards,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

//add flash card to deck
router
  .route("/flashcards")
  .post(
    [
      check("Question", "Invalid Question").not().isEmpty(),
      check("Answer", "Invalid answer").not().isEmpty(),
      check("DeckID", "Invalid deckID").not().isEmpty(),
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
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        const data = {
          deckID: req.body.DeckID,
          question: req.body.Question,
          answer: req.body.Answer,
        };
        const query = `CALL flashcard_add ("${data.deckID}","${data.question}","${data.answer}","${email}", "${password}")`;
        const results = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({
          status: "success",
          results,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );
//update flash card
router
  .route("/flashcards")
  .put(
    [
      check("Question", "Invalid Question").not().isEmpty(),
      check("Answer", "Invalid answer").not().isEmpty(),
      check("FlashCardID", "Invalid flashcardID").not().isEmpty(),
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
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        const data = {
          flashCardID: req.body.FlashCardID,
          question: req.body.Question,
          answer: req.body.Answer,
        };
        const query = `CALL flashcard_update ("${data.flashCardID}","${data.question}","${data.answer}","${email}", "${password}")`;
        const results = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({
          status: "success",
          results,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );
//   delete flash card
router
  .route("/flashcards")
  .delete(
    [check("FlashCardID", "Invalid Flash card id").not().isEmpty()],
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
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        const data = {
          flashCardID: req.body.FlashCardID,
        };
        const query = `CALL flashcard_delete ("${data.flashCardID}","${email}", "${password}")`;
        const results = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({
          status: "success",
          results,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

module.exports = router;
