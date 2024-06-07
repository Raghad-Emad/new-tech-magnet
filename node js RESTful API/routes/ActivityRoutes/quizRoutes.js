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
const { levelUp, requiredXp } = require("../../LevelSystem/Level");

//create quiz
router
  .route("/create")
  .post(
    [
      check("title", "Invalid title").not().isEmpty(),
      check("questions", "Quiz has no questions").isArray({ min: 1 }),
      oneOf([
        check("selectedModule", "Incorrect module id").isInt(),
        check("selectedModule", "Incorrect module id").isEmpty(),
      ]),
    ],
    checkAuth,
    async (req, res) => {
      try {
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        let quizID;
        let opID;
        //validate inputs
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }
        const data = {
          title: req.body.title,
          questions: req.body.questions,
          moduleID: req.body.selectedModule,
        };
        // console.log(data.title);
        // console.log(data);
        // console.log(data.questions[0].options);

        const query = `CALL quiz_create ("${data.title}",${data.moduleID}, "${email}", "${password}")`;
        const [[[results]]] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        quizID = results["LAST_INSERT_ID()"];

        // insert questions
        data.questions.map(async (question) => {
          console.log("correct answre is", question.correct);
          const query = `CALL quiz_add_question (${quizID},"${question.Question}","${question.Details}", "${question.Answer}")`;
          console.log("the query: ", query);
          const [[[results]]] = await pool.query(query).catch((err) => {
            // throw err;
            return res.status(400).json({ status: "failure", reason: err });
          });
          opID = results["LAST_INSERT_ID()"];
          question.options.map(async (option) => {
            const query = `CALL quiz_add_question_option (${opID},"${option}")`;
            console.log("the query: ", query);
            await pool.query(query);
            // const [[[results]]] = await pool.query(query).catch((err) => {
            //   // throw err;
            //   return res.status(400).json({ status: "failure", reason: err });
            // });

            // pool.query(query, (error, results) => {
            //   if (error) {
            //     return res.status(400).json({
            //       status: "failure",
            //       reason: error.code,
            //     });
            //   } else {
            //   }
            // });
          });

          // pool.query(query, (error, results) => {
          //   if (error) {
          //     return res
          //       .status(400)
          //       .json({ status: "failure", reason: error.code });
          //   } else {
          //     // get the question just inserted id
          //     opID = results[0][0]["LAST_INSERT_ID()"];
          //     console.log(opID);
          //     // insert options
          //     question.options.map((option) => {
          //       const query = `CALL quiz_add_question_option (${opID},"${option}")`;
          //       console.log("the query: ", query);
          //       pool.query(query, (error, results) => {
          //         if (error) {
          //           return res.status(400).json({
          //             status: "failure",
          //             reason: error.code,
          //           });
          //         } else {
          //         }
          //       });
          //     });
          //   }
          // });
        });

        // pool.query(query, (error, results) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     // get the quiz just inserted id
        //     quizID = results[0][0]["LAST_INSERT_ID()"];

        //     console.log(quizID);

        //     // insert questions
        //     data.questions.map((question) => {
        //       console.log("correct answre is", question.correct);
        //       const query = `CALL quiz_add_question (${quizID},"${question.Question}","${question.Details}", "${question.Answer}")`;
        //       console.log("the query: ", query);

        //       pool.query(query, (error, results) => {
        //         if (error) {
        //           return res
        //             .status(400)
        //             .json({ status: "failure", reason: error.code });
        //         } else {
        //           // get the question just inserted id
        //           opID = results[0][0]["LAST_INSERT_ID()"];
        //           console.log(opID);
        //           // insert options
        //           question.options.map((option) => {
        //             const query = `CALL quiz_add_question_option (${opID},"${option}")`;
        //             console.log("the query: ", query);
        //             pool.query(query, (error, results) => {
        //               if (error) {
        //                 return res.status(400).json({
        //                   status: "failure",
        //                   reason: error.code,
        //                 });
        //               } else {
        //               }
        //             });
        //           });
        //         }
        //       });
        //     });
        //   }

        //   return res.status(201).json({
        //     status: "success",
        //     quizID,
        //     // data: results[0],
        //   });
        // });

        ///
        // const query = `CALL quiz_create ("${data.title}",${data.moduleID}, "${email}", "${password}")`;
        // pool.query(query, (error, results) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     // get the quiz just inserted id
        //     quizID = results[0][0]["LAST_INSERT_ID()"];
        //     console.log(quizID);

        //     // insert questions
        //     data.questions.map((question) => {
        //       console.log("correct answre is", question.correct);
        //       const query = `CALL quiz_add_question (${quizID},"${question.Question}","${question.Details}", "${question.Answer}")`;
        //       console.log("the query: ", query);

        //       pool.query(query, (error, results) => {
        //         if (error) {
        //           return res
        //             .status(400)
        //             .json({ status: "failure", reason: error.code });
        //         } else {
        //           // get the question just inserted id
        //           opID = results[0][0]["LAST_INSERT_ID()"];
        //           console.log(opID);
        //           // insert options
        //           question.options.map((option) => {
        //             const query = `CALL quiz_add_question_option (${opID},"${option}")`;
        //             console.log("the query: ", query);
        //             pool.query(query, (error, results) => {
        //               if (error) {
        //                 return res.status(400).json({
        //                   status: "failure",
        //                   reason: error.code,
        //                 });
        //               } else {
        //               }
        //             });
        //           });
        //         }
        //       });
        //     });
        //   }
        return res.status(201).json({
          status: "success",
          quizID,
          // data: results[0],
        });
        // });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

// // view quiz
// router
//   .route("/view")
//   .get(
//     [check("quizID", "Enter a quiz id").not().isEmpty()],
//     checkAuth,
//     async (req, res) => {
//       try {
//         let quiz = { quizID: null, quizName: "", questions: [] };

//         const errs = validationResult(req);
//         if (!errs.isEmpty()) {
//           console.log(errs);
//           return res.status(400).json({
//             errors: errs.array(),
//           });
//         }
//         const quizID = req.query.quizID;
//         let query = `CALL quiz_view ("${quizID}")`;
//         // get quiz details
//         const [quized] = await pool.query(query).catch((err) => {
//           // throw err;
//           return res.status(400).json({ status: "failure", reason: err });
//         });
//         quiz.quizID = quized[0].QuizID;
//         quiz.quizName = quized[0].QuizName;

//         // get all questions from the quiz
//         query = `CALL quiz_question_view (${quizID})`;
//         const [questionsed] = await pool.query(query).catch((err) => {
//           // throw err;
//           return res.status(400).json({ status: "failure", reason: err });
//         });
//         console.log("all questions", questionsed);
//         // console.log(questionsed);
//         questionsed.map((quest) => {
//           let tempQuestion = {
//             id: "",
//             name: "",
//             details: "",
//             correct: "",
//             options: [],
//           };
//           tempQuestion.id = quest.QuestionID;
//           tempQuestion.name = quest.Question;
//           if (quest.details !== null && quest.details !== undefined)
//             tempQuestion.details = quest.details;
//           tempQuestion.correct = quest.Answer;

//           // console.log(tempQuestion);
//           quiz.questions.push(tempQuestion);
//         });

//         numQuests = quiz.questions.length;
//         await quiz.questions.map(async (quest, i) => {
//           query = `CALL quiz_question_option_view (${quizID},${quest.id})`;
//           const [optionsed] = await pool.query(query).catch((err) => {
//             // throw err;
//             return res.status(400).json({ status: "failure", reason: err });
//           });
//           // console.log(optionsed);
//           await quiz.questions.forEach((q) => {
//             if (q.id === optionsed[0].QuestionID) {
//               optionsed.map((op) => {
//                 q.options.push(op.TheOption);
//                 // console.log("new ops", q.options);
//               });
//             }
//           });
//           // console.log(numQuests);
//           // console.log(i);
//           if (i === numQuests - 1) {
//             // console.log("ops: ", quiz.questions);
//             console.log(quiz);
//             res.status(201).json(quiz);
//           }
//         });
//       } catch (err) {
//         return res.status(500).send(err);
//       }
//     }
//   );

// delete quiz
router
  .route("/delete")
  .delete(
    [check("quizID", "Enter a quiz id").not().isEmpty()],
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
        // const data = {
        //   quizID: req.body.quizID
        // };
        const query = `CALL quiz_delete(${req.body.quizID},"${email}","${password}")`;
        console.log(query);
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

// check answers
router
  .route("/checkAnswers")
  .post(
    [
      check("quizID", "Invalid quizID").not().isEmpty(),
      check("answers", "No answers").isArray({ min: 1 }),
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
          quizID: req.body.quizID,
          ans: req.body.answers,
        };
        const query1 = `SELECT * FROM quizclassassignments WHERE QuizID = ${data.quizID}`;
        const [[quiz]] = await pool.query(query1).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        console.log(quiz);
        const query = `CALL quiz_answers_by_id(${data.quizID})`;
        const [[correctAnswers]] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        console.log(correctAnswers);
        const wrongAnswers = [];
        console.log(correctAnswers);
        //check answers
        //check if same length
        if (data.ans.length === correctAnswers.length) {
          //loop through correct and check against answers
          correctAnswers.map((corAns) => {
            data.ans.map((answer, i) => {
              if (answer.questionID === corAns.QuestionID) {
                if (answer.ans != corAns.Answer) {
                  wrongAnswers.push(answer.questionID);
                }
              }
            });
          });
        }
        const score = correctAnswers.length - wrongAnswers.length;
        const xp = Math.ceil(quiz.Xp * (score / correctAnswers.length));
        // console.log(password);
        const coins = Math.ceil(quiz.Coins * (score / correctAnswers.length));
        // console.log(coins);

        //get current xp and level from database
        const queryDetails = `CALL get_student_details ("${email}", "${password}")`;
        console.log(queryDetails);
        const [[details]] = await pool.query(queryDetails).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        console.log(details);
        console.log("Student details: ", details[0]);
        //calculate the level
        const levelSystem = levelUp(details[0].Level, details[0].Xp, xp);
        // console.log("levelss", levelSystem);
        const remainingXp = requiredXp(levelSystem.level);

        const query3 = `CALL quiz_submission_add(${data.quizID},${score},${levelSystem.xp},${levelSystem.level},${coins},"${email}","${password}")`;
        console.log(query3);
        await pool.query(query3).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({
          status: "success",
          correctAnswers,
          wrongAnswers,
          xp,
          coins,
          totalXp: levelSystem.xp,
          level: levelSystem.level,
          remainingXp,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

// get all quizzes
router.route("/all").get(checkAuth, async (req, res) => {
  try {
    //get these values from check auth (JWT)
    const email = req.user.email;
    const password = req.user.password;
    const query = `CALL quiz_all_by_teacher ("${email}", "${password}")`;
    console.log(query);
    const [quizzes] = await pool.query(query).catch((err) => {
      // throw err;
      return res.status(400).json({ status: "failure", reason: err });
    });
    return res.status(200).json({
      status: "success",
      quizzes,
    });
  } catch (err) {}
});

// get all quizzes by class
router
  .route("/all/class")
  .get(
    [check("classID", "Invalid class ID").not().isEmpty()],
    checkAuth,
    async (req, res) => {
      try {
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;
        const classID = req.query.classID;
        const query = `CALL quiz_all_by_teacher_classID (${classID},"${email}", "${password}")`;
        console.log(query);
        const [[quizzes]] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        return res.status(200).json({
          status: "success",
          quizzes,
        });
      } catch (err) {}
    }
  );

//test
router
  .route("/view")
  .get(
    [check("quizID", "Enter a quiz id").not().isEmpty()],
    checkAuth,
    async (req, res) => {
      try {
        let quiz = { quizID: null, quizName: "", questions: [] };

        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }
        const quizID = req.query.quizID;
        let query = `CALL quiz_view ("${quizID}")`;
        // get quiz details
        const [[quized]] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        console.log(quized);
        quiz.quizID = quized[0].QuizID;
        quiz.quizName = quized[0].QuizName;
        quiz.moduleID = quized[0].ModuleID;

        // get all questions from the quiz
        query = `CALL quiz_question_view (${quizID})`;
        const [[questionsed]] = await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        quiz.questions = questionsed;

        // numQuests = quiz.questions.length;
        await quiz.questions.forEach(async (quest, i, array) => {
          // console.log("returned ", quest);
          query = `CALL quiz_question_option_view (${quizID},${quest.QuestionID})`;
          // console.log("getting option:", query);
          // console.log(query);
          const [[optionsed]] = await pool.query(query).catch((err) => {
            // throw err;
            return res.status(400).json({ status: "failure", reason: err });
          });
          quiz.questions[i].options = optionsed;
          // if (i === array.length - 1) {
          //   // console.log(array);
          //   res.status(201).json({ status: "success", quiz });
          // }
          let isDone = true;
          array.map((it) => {
            if (!it.hasOwnProperty("options")) isDone = false;
          });

          if (isDone === true) {
            console.log("dis", quiz);
            res.status(201).json({ status: "success", quiz });
          }
        });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

//update quiz
router
  .route("/update")
  .put(
    [
      check("quizID", "Invalid quiz id").not().isEmpty(),
      check("title", "Invalid title").not().isEmpty(),
      check("questions", "Quiz has no questions").isArray({ min: 1 }),
      oneOf([
        check("selectedModule", "Incorrect module id").isInt(),
        check("selectedModule", "Incorrect module id").isEmpty(),
      ]),
    ],
    checkAuth,
    async (req, res) => {
      try {
        //get these values from check auth (JWT)
        const email = req.user.email;
        const password = req.user.password;

        let quizID;
        let opID;
        //validate inputs
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
          console.log(errs);
          return res.status(400).json({
            errors: errs.array(),
          });
        }
        const data = {
          quizID: req.body.quizID,
          title: req.body.title,
          questions: req.body.questions,
          moduleID: req.body.selectedModule,
        };
        //delete old questions
        const deleteQuery = `CALL quiz_delete_questions(${data.quizID})`;
        console.log(deleteQuery);
        const results = await pool.query(deleteQuery).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        console.log(results);

        // console.log(data.title);
        // console.log(data);
        // console.log(data.questions[0].options);

        const query = `CALL quiz_update (${data.quizID},"${data.title}",${data.moduleID}, "${email}", "${password}")`;
        await pool.query(query).catch((err) => {
          // throw err;
          return res.status(400).json({ status: "failure", reason: err });
        });
        // insert questions
        data.questions.map(async (question) => {
          const query = `CALL quiz_add_question (${data.quizID},"${question.Question}","${question.Details}", "${question.Answer}")`;
          console.log("the query: ", query);
          const [[[results]]] = await pool.query(query).catch((err) => {
            // throw err;
            return res.status(400).json({ status: "failure", reason: err });
          });
          // get the question just inserted id
          console.log("////", results);
          // opID = results[0][0]["LAST_INSERT_ID()"];
          opID = results["LAST_INSERT_ID()"];
          console.log(opID);
          // insert options
          question.options.map(async (option) => {
            let query;
            if (option.hasOwnProperty("TheOption")) {
              query = `CALL quiz_add_question_option (${opID},"${option.TheOption}")`;
            } else {
              query = `CALL quiz_add_question_option (${opID},"${option}")`;
            }
            console.log("the query: ", query);

            const results = await pool.query(query).catch((err) => {
              // throw err;
              return res.status(400).json({ status: "failure", reason: err });
            });

            // pool.query(query, (error, results) => {
            //   if (error) {
            //     return res.status(400).json({
            //       status: "failure",
            //       reason: error.code,
            //     });
            //   } else {
            //   }
            // });
          });

          // pool.query(query, (error, results) => {
          //   if (error) {
          //     return res
          //       .status(400)
          //       .json({ status: "failure", reason: error.code });
          //   } else {
          //     // get the question just inserted id
          //     opID = results[0][0]["LAST_INSERT_ID()"];
          //     console.log(opID);
          //     // insert options
          //     question.options.map((option) => {
          //       let query;
          //       if (option.hasOwnProperty("TheOption")) {
          //         query = `CALL quiz_add_question_option (${opID},"${option.TheOption}")`;
          //       } else {
          //         query = `CALL quiz_add_question_option (${opID},"${option}")`;
          //       }
          //       console.log("the query: ", query);
          //       pool.query(query, (error, results) => {
          //         if (error) {
          //           return res.status(400).json({
          //             status: "failure",
          //             reason: error.code,
          //           });
          //         } else {
          //         }
          //       });
          //     });
          //   }
          // });
        });

        /////

        // // const query = `CALL quiz_update (${data.quizID},"${data.title}",${data.moduleID}, "${email}", "${password}")`;
        // pool.query(query, (error, results) => {
        //   if (error) {
        //     return res
        //       .status(400)
        //       .json({ status: "failure", reason: error.code });
        //   } else {
        //     // insert questions
        //     data.questions.map((question) => {
        //       const query = `CALL quiz_add_question (${data.quizID},"${question.Question}","${question.Details}", "${question.Answer}")`;
        //       console.log("the query: ", query);

        //       pool.query(query, (error, results) => {
        //         if (error) {
        //           return res
        //             .status(400)
        //             .json({ status: "failure", reason: error.code });
        //         } else {
        //           // get the question just inserted id
        //           opID = results[0][0]["LAST_INSERT_ID()"];
        //           console.log(opID);
        //           // insert options
        //           question.options.map((option) => {
        //             let query;
        //             if (option.hasOwnProperty("TheOption")) {
        //               query = `CALL quiz_add_question_option (${opID},"${option.TheOption}")`;
        //             } else {
        //               query = `CALL quiz_add_question_option (${opID},"${option}")`;
        //             }
        //             console.log("the query: ", query);
        //             pool.query(query, (error, results) => {
        //               if (error) {
        //                 return res.status(400).json({
        //                   status: "failure",
        //                   reason: error.code,
        //                 });
        //               } else {
        //               }
        //             });
        //           });
        //         }
        //       });
        //     });
        //   }
        return res.status(201).json({
          status: "success",
          quizID,
          // data: results[0],
        });
        // });
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  );

module.exports = router;
