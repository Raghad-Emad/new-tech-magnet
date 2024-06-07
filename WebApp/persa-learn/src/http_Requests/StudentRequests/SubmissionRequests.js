import { hostAddress } from "../../config/hostAddress";
import { checkTokenCorrect } from "../userRequests";

export const shareSubmission = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/submission`, {
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

export const unshareSubmission = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/submission`, {
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

export const getStudentsSubmissionsByClass = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/submission/class/student`, {
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
