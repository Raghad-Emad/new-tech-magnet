import { hostAddress } from "../config/hostAddress";
import { checkTokenCorrect } from "./userRequests";

export const updateUserDetails = (credentials) => {
  // console.log(hostAddress());
  const token = JSON.parse(sessionStorage.getItem("token"));
  let data = fetch(`${hostAddress()}/student/`, {
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
