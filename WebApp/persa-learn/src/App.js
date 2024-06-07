import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//import functions
import useToken from "./useToken";

//import pages
import Home from "./Pages/Home";
import Error from "./Pages/Error";
import Login from "./Pages/Login";
import Activities from "./Pages/RevisionActivities";
// import CreateActivity from "./Pages/CreateActivity";
import Quiz from "./Pages/Activities/Quiz";
import FlashCards from "./Pages/Activities/FlashCards";
import QuizDesigner from "./Pages/ActivityDesigner/Quiz/QuizDesigner";
import FlashCard from "./Pages/Activities/FlashCard";
import ClassLeaderboard from "./Pages/ClassLeaderboard";
import FlashcardDesigner from "./Pages/ActivityDesigner/FlashcardDesigner";
import StudentProfile from "./Pages/StudentProfile";
import TeacherProfile from "./Pages/Teacher/TeacherProfile";

//components
import Navbar from "./Components/Navbar";
import UserSettings from "./Pages/UserSettings";
import EditUserSettings from "./Pages/EditUserSettings";
import AssignActivities from "./Pages/AssignActivities/AssignActivities";
import EditCardsInDeck from "./Pages/Activities/FlashCards/EditCardsInDeck";
import Shop from "./Pages/Shop";
import AdminProfile from "./Pages/Admin/AdminProfile";
import ThemesAll from "./Pages/Admin/ThemesAll";
import ThemesAdd from "./Pages/Admin/ThemesAdd";
import ThemesEdit from "./Pages/Admin/ThemesEdit";
import BannersAll from "./Pages/Admin/BannersAll";
import ProfilePicturesAll from "./Pages/Admin/ProfilePicturesAll";
import TeacherDetails from "./Pages/Teacher/TeacherDetails";
import TeacherEdit from "./Pages/Teacher/TeacherEdit";
import QuizEdit from "./Pages/ActivityDesigner/Quiz/QuizEdit";
import AssignmentSubmissions from "./Pages/Teacher/AssignmentSubmissions";
import { Classes } from "./Pages/Teacher/Classes";
import { default as StudentsClasses } from "./Pages/Student/Classes";
import ShopManagement from "./Components/Admin/ShopManagement";
import AccountActions from "./Components/Admin/AccountActions";
import CreateAdmin from "./Components/Admin/CreateAdmin";
import EditAccountSettings from "./Pages/Admin/EditAccountSettings";
import Landing from "./Pages/Landing";

function App() {
  const { token, setToken } = useToken();

  const [isTeacher, setIsTeacher] = useState(
    sessionStorage.getItem("teacher") === "true"
  );
  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem("admin") === "true"
  );
  useEffect(() => {
    setIsTeacher(sessionStorage.getItem("teacher") === "true");
    setIsAdmin(sessionStorage.getItem("admin") === "true");
  });
  useEffect(() => {
    //get theme from local storage
    let theme = JSON.parse(localStorage.getItem("theme"));

    //set themes
    if (theme && !isTeacher && !isAdmin && token) {
      try {
        // setTheme(theme);
        setTheme(
          theme.id,
          theme.backgroundColor,
          theme.primaryColor,
          theme.btnTextColor,
          theme.isDark
        );
      } catch (err) {}
    } else {
      setTheme();
    }
  });
  const setTheme = (
    id,
    backgroundColor = "white",
    primaryColor = "#201d95",
    btnTextColor = "white",
    isDark = false
  ) => {
    document.documentElement.style.setProperty(
      "--background-color",
      backgroundColor
    );
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty(
      "--btn-text-color",
      btnTextColor
    );
    document.documentElement.style.setProperty(
      "--text-color",
      isDark ? "#c9d1d9" : "black"
    );
    document.documentElement.style.setProperty(
      "--items-container",
      isDark ? "rgba(255, 255, 255, 0.1)" : "rgb(0, 0, 0, 0.05)"
    );
  };

  if (!token) {
    // return <Login setToken={setToken} />;
    return (
      <div className="App">
        <Router>
          {/* <Navbar /> */}
          <Routes>
            <Route
              exact
              path="/"
              element={
                <>
                  <Navbar /> <Landing />
                </>
              }
            />
            <Route
              exact
              path="/login"
              element={<Login setToken={setToken} />}
            />
            <Route path="*" element={<Login setToken={setToken} />} />
          </Routes>
        </Router>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          {/* shared routes */}
          {/* <Route exact path="/" element={<Home setToken={setToken} />} /> */}
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/leaderboard" element={<ClassLeaderboard />} />
          <Route path="*" element={<Error />} />

          {/* student routes */}
          {token && !isTeacher && !isAdmin ? (
            <>
              <Route
                exact
                path="/profile_student"
                element={<StudentProfile />}
              />
              <Route exact path="/" element={<StudentProfile />} />
              <Route exact path="/classes" element={<StudentsClasses />} />
              <Route exact path="/user_settings" element={<UserSettings />} />
              <Route
                exact
                path="/user_settings/edit"
                element={<EditUserSettings />}
              />
              <Route exact path="/flash-cards" element={<FlashCards />} />
              <Route exact path="/flash-card" element={<FlashCard />} />
              <Route
                exact
                path="/flash-card/edit"
                element={<EditCardsInDeck />}
              />
              <Route
                exact
                path="/designer_flashcard"
                element={<FlashcardDesigner />}
              />
              <Route exact path="/shop" element={<Shop />} />
              <Route exact path="/revision" element={<Activities />} />
            </>
          ) : (
            <></>
          )}

          <Route exact path="/quiz" element={<Quiz />} />

          {/* teacher routes */}
          {isTeacher && token && !isAdmin ? (
            <>
              <Route
                exact
                path="/profile_teacher"
                element={<TeacherProfile />}
              />
              <Route exact path="/" element={<TeacherProfile />} />
              <Route
                exact
                path="/details_teacher"
                element={<TeacherDetails />}
              />
              <Route exact path="/edit_teacher" element={<TeacherEdit />} />
              <Route exact path="/Assign" element={<AssignActivities />} />
              <Route exact path="/designer_quiz" element={<QuizDesigner />} />
              <Route exact path="/designer_quiz/edit" element={<QuizEdit />} />
              <Route
                exact
                path="/Assign/submissions"
                element={<AssignmentSubmissions />}
              />
              <Route exact path="/classes" element={<Classes />} />
            </>
          ) : (
            <></>
          )}

          {/* Admin routes */}
          {isAdmin && token && !isTeacher ? (
            <>
              <Route exact path="/profile_admin" element={<AdminProfile />} />
              <Route exact path="/" element={<AdminProfile />} />
              <Route exact path="/shop" element={<ShopManagement />} />
              <Route exact path="/account" element={<AccountActions />} />
              <Route
                exact
                path="/account/edit"
                element={<EditAccountSettings />}
              />
              <Route exact path="/create" element={<CreateAdmin />} />
              <Route exact path="/themes" element={<ThemesAll />} />
              <Route exact path="/themes/add" element={<ThemesAdd />} />
              <Route exact path="/themes/edit" element={<ThemesEdit />} />
              <Route exact path="/banners" element={<BannersAll />} />
              <Route
                exact
                path="/profilePictures"
                element={<ProfilePicturesAll />}
              />
            </>
          ) : (
            <></>
          )}
          {/* temp routes */}
          {/* <Route exact path="/create" element={<CreateActivity />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
