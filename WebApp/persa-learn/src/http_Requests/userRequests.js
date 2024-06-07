import { hostAddress } from "../config/hostAddress";

export const checkTokenCorrect = (status) => {
  status.then((value) => {
    // console.log(value.errors[0].message);
    // ask to log back in if token invalid
    if (
      value.hasOwnProperty("errors") &&
      value.errors[0].message === "Invalid Token"
    ) {
      sessionStorage.clear();
      window.location.reload();
    }
  });
};

export const loginUser = async (credentials, isTeacher, isAdmin) => {
  let url;
  if (isAdmin) {
    url = `${hostAddress()}/admin/login`;
  } else if (isTeacher) {
    url = `${hostAddress()}/teacher/login`;
  } else {
    console.log(hostAddress());
    url = `${hostAddress()}/student/login`;
  }
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

export const signUpUser = (credentials, isTeacher) => {
  let url;
  if (isTeacher) {
    url = `${hostAddress()}/teacher/create`;
  } else {
    url = `${hostAddress()}/student/create`;
  }
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

export const getUserDetails = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/student/details`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const getStudentsAssignmentQuizzes = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const data = fetch("http://localhost:8080/student/assignments/quizzes", {
  const data = fetch(`${hostAddress()}/assignments/quizzes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());

  checkTokenCorrect(data);
  return data;
};

export const getStudentsClassses = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const data = fetch("http://localhost:8080/student/classes", {
  const data = fetch(`${hostAddress()}/classes/student`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());

  checkTokenCorrect(data);
  return data;
  // return data;
};
export const getStudentsInClass = (classID) => {
  // console.log(JSON.stringify(classID));
  console.log(classID);

  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/student/class`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify(classID),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const getQuiz = (quizID) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/quiz/view?quizID=${quizID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const checkAnswers = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  console.log(credentials);
  const data = fetch(`${hostAddress()}/quiz/checkAnswers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};
