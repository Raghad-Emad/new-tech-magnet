import { hostAddress } from "../../config/hostAddress";
import { checkTokenCorrect } from "../userRequests";

export const getFeedRequest = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const data = fetch(`${hostAddress()}/feed`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      autherization: token,
    },
  }).then((data) => data.json());
  checkTokenCorrect(data);
  return data;
};
