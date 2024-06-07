import { hostAddress } from "../config/hostAddress";
import { checkTokenCorrect } from "./userRequests";

export const assignQuizToClass = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(
    // "http://localhost:8080/teacher/activity/assignments/quiz/class",
    // "http://localhost:8080/assignments/quiz/class",
    `${hostAddress()}/assignments/quiz/class`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        autherization: token,
      },
      body: JSON.stringify(credentials),
    }
  ).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const unassignQuizFromClass = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/assignments/quiz/class/`, {
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

export const getAssignmentProgress = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(
    `${hostAddress()}/assignments/progress?classID=${credentials.cID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        autherization: token,
      },
    }
  ).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const getQuizSubmissions = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(
    `${hostAddress()}/assignments/submissions?classID=${
      credentials.cID
    }&quizID=${credentials.qID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        autherization: token,
      },
    }
  ).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};
