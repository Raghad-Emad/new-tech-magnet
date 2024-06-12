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
  console.log("Login credentials:", credentials);

  // const response = await fetch(url, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(credentials),
  // })
  // .then((data) => data.json());


// const data = await response.json();
// console.log("Login response data:", data); 

//   if (response.ok && data.token) {
//     const token = data.token;
//     sessionStorage.setItem("token", JSON.stringify(token));
//     console.log("Token stored:", token);
//   } else {
//     // throw new Error(data.message);
//     console.error("Failed to login or missing token in response:", data);
//     throw new Error(data.message || "Failed to login");
//   }

try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    console.log("HTTP Status:", response.status);

    let responseData;
    let data;
    try {
      responseData = await response.text();
      console.log("Raw response data:", responseData);
      data = JSON.parse(responseData);
    } catch (error) {
      // Handle cases where the response is not JSON
      console.error("Failed to parse JSON response:", error);
      throw new Error("Failed to parse response");
    }

    console.log("Login response data:", data);

    if (response.ok && data.token) {
      const token = data.token;
      sessionStorage.setItem("token", token);
      console.log("Token stored:", token);
      return data;
    } else {
      console.error("Failed to login or missing token in response:", data);
      throw new Error(data.message || "Failed to login");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Login failed: " + error.message);
  }
};

//   return data;
// };


export const signUpUser = (credentials, isTeacher) => {

  console.log("Sign up user:", credentials); // Log the credentials
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
//   }).then((data) => data.json());
// };
}).then((response) => {
  console.log("Response status:", response.status);
  if (!response.ok) {
    console.error("Sign up failed:", response.statusText);
    return response.text().then(text => { throw new Error(text) }); // Throw error with response body
  }
  return response.json();
})
.catch(error => {
  console.error("Error during sign up:", error);
  throw error; // Re-throw the error to handle it further up the call stack
});
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
