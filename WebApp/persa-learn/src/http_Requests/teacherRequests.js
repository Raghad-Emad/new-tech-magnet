import { hostAddress } from "../config/hostAddress";
import { checkTokenCorrect } from "./userRequests";

export const getTeachersDetails = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const data = fetch("http://localhost:8080/teacher/classes", {
  const data = fetch(`${hostAddress()}/teacher`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const editTeachers = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const data = fetch("http://localhost:8080/teacher/classes", {
  const data = fetch(`${hostAddress()}/teacher/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const editPasswordTeachers = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/teacher/update/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const deleteTeacher = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const data = fetch("http://localhost:8080/teacher/classes", {
  const data = fetch(`${hostAddress()}/teacher/update`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const getTeachersClasses = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const data = fetch("http://localhost:8080/teacher/classes", {
  const data = fetch(`${hostAddress()}/classes/teacher`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const allStudents = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/teacher/students/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const searchStudents = (searchTerm) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/teacher/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify({ searchTerm: searchTerm }),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const addStudentToClass = (details) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/teacher/classes/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify(details),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const removeStudentFromClass = (details) => {
  console.log(details);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/teacher/classes/remove`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify(details),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const createClass = (details) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const data = fetch("http://localhost:8080/teacher/classes", {
  const data = fetch(`${hostAddress()}/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify(details),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const updateClass = (details) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const data = fetch("http://localhost:8080/teacher/classes", {
  const data = fetch(`${hostAddress()}/classes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify(details),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const deleteClass = (details) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/classes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify(details),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const getStudentsInClass = (classID) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/teacher/class`, {
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

export const createTheQuiz = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/quiz/create`, {
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

export const deleteTheQuiz = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/quiz/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const viewTeachersQuizzes = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/quiz/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const viewTeachersQuizzesByClass = (credentials) => {
  console.log("aaa", credentials);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(
    `${hostAddress()}/quiz/all/class/?classID=${credentials}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        autherization: token,
      },
      //body: JSON.stringify(credentials),
    }
  ).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const viewTeachersModules = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/module/view`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const createModule = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/module/create`, {
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
