export const hostAddress = () => {
  if (process.env.NODE_ENV != "production") {
    return `http://${window.location.hostname}:8080`;
  } else {
    return "http://178.62.104.116:8080";
  }
  // return local address
  // console.log(window.location.hostname);
  // return `http://${window.location.hostname}:8080`;
  // return "http://localhost:8080";
  // return "http://178.62.104.116:8080";
  // return "http://178.62.104.116:8080";
  // console.log("api add: " + window.location.hostname);
  // return `http://${window.location.hostname}:8080`;
};
