// if (process.env.NODE_ENV != "production") {
//   const dotenv = require("dotenv").config({ path: "./.env" });
// }

// const cookieParser = require("cookie-parser");
// const express = require("express");

// const studentRouter = require("./routes/studentRoutes");
// const teacherRouter = require("./routes/teacherRoutes");
// const adminRouter = require("./routes/adminRoutes");
// const assignmentsRouter = require("./routes/assignmentsRoutes");
// const classesRouter = require("./routes/classRoutes");
// const classRequestRouter = require("./routes/ClassRoutes/ClassRequestsRoutes");
// const moduleRouter = require("./routes/moduleRoutes");
// const quizRouter = require("./routes/ActivityRoutes/quizRoutes");
// const flashcardRouter = require("./routes/ActivityRoutes/flashcardRoutes");
// const themesRouter = require("./routes/ItemRoutes/themeRoutes");
// const profilePsRouter = require("./routes/ItemRoutes/profilePictureRoutes");
// const bannersRouter = require("./routes/ItemRoutes/bannerRoutes");
// const ratingRouter = require("./routes/ActivityRoutes/ratingRoutes");
// const adminStatRouter = require("./routes/adminStatRoutes");
// const submissionRouter = require("./routes/submissionRoutes");
// const feedRouter = require("./routes/feedRoutes");
// const teacherStatRouter = require("./routes/teacherStatRoutes");

// const cors = require("cors");
// const { levelUp } = require("./LevelSystem/Level");

// const app = express();

// // const corsOptions = {
// //   origin: true, //included origin as true
// //   credentials: true, //included credentials as true
// // };

// //middleware
// // app.use(cookieParser());
// app.use(express.json());
// // if (process.env.NODE_ENV != "production") {
// //   app.use(cors());
// // }
// //containers run on same host
// // app.use(cors());

// // const cors = require('cors');
// // app.use(cors({
// //   origin: 'http://localhost:3000' // Adjust to your frontend's URL
// // }));


// app.use(cors()); // Allows all origins by default
// // If you need to restrict to specific origins:
// app.use(cors({ origin: 'http://localhost:3000' })); // Adjust as necessary

// // app.use(cors(corsOptions));

// //redirect requests to endpoint starting with /posts to postRoutes.js
// app.use("/student", studentRouter);
// app.use("/teacher", teacherRouter);
// app.use("/admin", adminRouter);
// app.use("/assignments", assignmentsRouter);
// app.use("/classes", classesRouter);
// app.use("/classRequests", classRequestRouter);
// app.use("/module", moduleRouter);
// app.use("/quiz", quizRouter);
// app.use("/decks", flashcardRouter);
// app.use("/profilePicture", profilePsRouter);
// app.use("/theme", themesRouter);
// app.use("/banner", bannersRouter);
// app.use("/rating", ratingRouter);
// app.use("/stats", adminStatRouter);
// app.use("/submission", submissionRouter);
// app.use("/feed", feedRouter);
// app.use("/tstats", teacherStatRouter);

// const port = process.env.PORT || 8080;
// app.listen(port, () => {
//   console.log(`API started on port: ${port}`);
// });
// // console.log();
// // console.log("a", process.env.BACKEND_SERVER);
// console.log("ab", process.env.MYSQL_PASSWORD);
// app.get("/", async (req, res) => {
//   // console.log("test");
//   const cred = {
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE,
//     host: process.env.MYSQL_HOST,
//   };

//   res.json({
//     status: `Ready to go ${process.env.DB_USER}`,
//   });
// });

// // console.log(levelUp(1, 100071, 0));


if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config({ path: "./.env" });
}

const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const checkAuth = require("./middleware/checkAuth.js");
const { levelUp } = require("./LevelSystem/Level");
const jwt = require("jsonwebtoken");


const studentRouter = require("./routes/studentRoutes");
const teacherRouter = require("./routes/teacherRoutes");
const adminRouter = require("./routes/adminRoutes");
const assignmentsRouter = require("./routes/assignmentsRoutes");
const classesRouter = require("./routes/classRoutes");
const classRequestRouter = require("./routes/ClassRoutes/ClassRequestsRoutes");
const moduleRouter = require("./routes/moduleRoutes");
const quizRouter = require("./routes/ActivityRoutes/quizRoutes");
const flashcardRouter = require("./routes/ActivityRoutes/flashcardRoutes");
const themesRouter = require("./routes/ItemRoutes/themeRoutes");
const profilePsRouter = require("./routes/ItemRoutes/profilePictureRoutes");
const bannersRouter = require("./routes/ItemRoutes/bannerRoutes");
const ratingRouter = require("./routes/ActivityRoutes/ratingRoutes");
const adminStatRouter = require("./routes/adminStatRoutes");
const submissionRouter = require("./routes/submissionRoutes");
const feedRouter = require("./routes/feedRoutes");
const teacherStatRouter = require("./routes/teacherStatRoutes");
// const protectedRoutes = require('./routes/protectedRoutes');



const app = express();

// Middleware
app.use(express.json());
app.use(cors());

console.log('Current working directory:', process.cwd());

// // Add console log to check the resolved path to the routes directory
// const path = require('path');
// console.log('Resolved path to routes directory:', path.resolve(__dirname, 'routes'));

// Require the routes
// const studentRoutes = require('../node js RESTful API/routes/studentRoutes.js');

// Routes
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/admin", adminRouter);
app.use("/assignments", assignmentsRouter);
app.use("/classes", classesRouter);
app.use("/classRequests", classRequestRouter);
app.use("/module", moduleRouter);
app.use("/quiz", quizRouter);
app.use("/decks", flashcardRouter);
app.use("/profilePicture", profilePsRouter);
app.use("/theme", themesRouter);
app.use("/banner", bannersRouter);
app.use("/rating", ratingRouter);
app.use("/stats", adminStatRouter);
app.use("/submission", submissionRouter);
app.use("/feed", feedRouter);
app.use("/tstats", teacherStatRouter);
// app.use('/api', protectedRoutes);



// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

console.log("ab", process.env.DB_PASS);

app.get("/", async (req, res) => {
  const cred = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  };

  res.json({
    status: `Ready to go ${process.env.DB_USER}`,
  });
});


// // Apply the checkAuth middleware to a route
// app.get('/protected-route', checkAuth, (req, res) => {
//   // Route handler logic here
//   res.json({ message: "This is a protected route" });
// });



// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });