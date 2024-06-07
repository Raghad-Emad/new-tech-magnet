if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config({ path: "./.env" });
}

const cookieParser = require("cookie-parser");
const express = require("express");

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

const cors = require("cors");
const { levelUp } = require("./LevelSystem/Level");

const app = express();

// const corsOptions = {
//   origin: true, //included origin as true
//   credentials: true, //included credentials as true
// };

//middleware
// app.use(cookieParser());
app.use(express.json());
// if (process.env.NODE_ENV != "production") {
//   app.use(cors());
// }
//containers run on same host
app.use(cors());

// app.use(cors(corsOptions));

//redirect requests to endpoint starting with /posts to postRoutes.js
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

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`API started on port: ${port}`);
});
// console.log();
// console.log("a", process.env.BACKEND_SERVER);
console.log("ab", process.env.MYSQL_PASSWORD);
app.get("/", async (req, res) => {
  // console.log("test");
  const cred = {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
  };

  res.json({
    status: `Ready to go ${process.env.DB_USER}`,
  });
});

// console.log(levelUp(1, 100071, 0));
