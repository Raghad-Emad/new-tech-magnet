import { hostAddress } from "../../config/hostAddress";
import { checkTokenCorrect } from "../userRequests";

export const getAdminDetails = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/admin/details`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};

export const createAdmin = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/admin/create`, {
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

export const editAdmin = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/admin/`, {
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

export const changePasswordAdmin = (credentials) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/admin/password`, {
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
