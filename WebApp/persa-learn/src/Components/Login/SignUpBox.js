// import React, { useState } from "react";
// import CustomButton from "../CustomButton";
// import CustomInput from "../CustomInput";

// import { signUpUser } from "../../http_Requests/userRequests";

// import styles from "./SignUpBox.module.css";

// const SignUpBox = ({ setSignUp, isTeacher }) => {
//   const [email, setEmail] = useState();
//   const [password, setPassword] = useState();
//   const [confPassword, setConfPassword] = useState();
//   const [firstname, setFirstname] = useState();
//   const [lastname, setLastname] = useState();
//   const [phonenumber, setPhonenumber] = useState();

//   const [emailError, setEmailError] = useState();
//   const [passwordError, setPasswordError] = useState();
//   const [confPasswordError, setConfPasswordError] = useState();
//   const [firstnameError, setFirstnameError] = useState();
//   const [lastnameError, setLastnameError] = useState();
//   const [phonenumberError, setPhonenumberError] = useState();

//   const [error, setError] = useState();
//   const [httpResponseCode, setHttpResponseCode] = useState();

//   const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const signUp = async (e) => {
//     // e.preventDefault();
//     if (email == null || email == "") {
//       setEmailError("Please enter an email");
//     } else if (!EMAIL_REGEX.test(email)) {
//       setEmailError("Please enter a valid email");
//     } else {
//       setEmailError(null);
//     }
//     if (password == null || password == "") {
//       setPasswordError("Please enter a password");
//     } else if (password.length < 8) {
//       setPasswordError("Password must be 8 or more characters");
//     } else {
//       setPasswordError(null);
//     }
//     if (confPassword == null || confPassword == "") {
//       setConfPasswordError("Please enter a password");
//     } else if (confPassword !== password) {
//       setConfPasswordError("Passwords do not match");
//     } else if (password.length < 8) {
//       setConfPasswordError("Password must be 8 or more characters");
//     } else {
//       setConfPasswordError(null);
//     }
//     if (firstname == null || firstname == "") {
//       setFirstnameError("Please enter a firstname");
//     } else {
//       setFirstnameError(null);
//     }
//     if (lastname == null || lastname == "") {
//       setLastnameError("Please enter a lastname");
//     } else {
//       setLastnameError(null);
//     }
//     if (isTeacher && (phonenumber == null || phonenumber == "")) {
//       setPhonenumberError("Please enter a phonenumber");
//     } else {
//       setPhonenumberError(null);
//     }

//     if (
//       email != null &&
//       password != null &&
//       firstname != null &&
//       lastname != null &&
//       email != "" &&
//       password != "" &&
//       firstname != "" &&
//       lastname != "" &&
//       confPassword == password &&
//       EMAIL_REGEX.test(email) &&
//       password.length >= 8
//     ) {
//       try {
//         let data;
//         if (!isTeacher) {
//           data = await signUpUser(
//             {
//               email,
//               password,
//               firstname,
//               lastname,
//             },
//             isTeacher
//           );
//         } else {
//           data = await signUpUser(
//             {
//               email,
//               password,
//               firstname,
//               lastname,
//               phonenumber,
//             },
//             isTeacher
//           );
//         }
//         if (data !== null && data.status === "success") {
//           setSignUp(false);
//           alert("Account created successfully");
//         } else if (data.status == "failure") {
//           if (data.reason == "ER_DUP_ENTRY") {
//             setError("This user already exists");
//           }
//         } else {
//           setError("Could not create user");
//         }
//       } catch (e) {
//         console.log("error occured: ", e);
//       }
//     }
//   };
//   return (
//     // <div className="right-box">
//     <>
//       <h1>Sign up</h1>
//       <div className={styles.error}>{error}</div>

//       <label htmlFor="email"></label>
//       <div className={styles.error}>{emailError}</div>
//       <CustomInput name={"email"} placeholder={"email"} setValue={setEmail} />

//       <label htmlFor="password"></label>
//       <div className={styles.error}>{passwordError}</div>
//       <CustomInput
//         password={true}
//         name={"password"}
//         placeholder={"password"}
//         setValue={setPassword}
//       />

//       <label htmlFor="confirmPassword"></label>
//       <div className={styles.error}>{confPasswordError}</div>
//       <CustomInput
//         password={true}
//         name={"confPassword"}
//         placeholder={"confirm password"}
//         setValue={setConfPassword}
//       />

//       <label htmlFor="firstname"></label>
//       <div className={styles.error}>{firstnameError}</div>
//       <CustomInput
//         name={"firstname"}
//         placeholder={"first name"}
//         setValue={setFirstname}
//       />

//       <label htmlFor="lastname"></label>
//       <div className={styles.error}>{lastnameError}</div>
//       <CustomInput
//         name={"lastname"}
//         placeholder={"last name"}
//         setValue={setLastname}
//       />

//       {isTeacher ? (
//         <>
//           <label htmlFor="phonenumber"></label>
//           <div className={styles.error}>{phonenumberError}</div>

//           <CustomInput
//             name={"phone number"}
//             placeholder={"phonenumber"}
//             setValue={setPhonenumber}
//           />
//         </>
//       ) : (
//         <></>
//       )}
//       <CustomButton type={1} text={"Sign up"} onClick={() => signUp()} />
//       <CustomButton type={2} text={"Login"} onClick={() => setSignUp(false)} />
//     </>
//   );
// };

// export default SignUpBox;


import React, { useState } from "react";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import { signUpUser } from "../../http_Requests/userRequests";
import styles from "./SignUpBox.module.css";

const SignUpBox = ({ setSignUp, isTeacher }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confPasswordError, setConfPasswordError] = useState("");
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [phonenumberError, setPhonenumberError] = useState("");

  const [error, setError] = useState("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const signUp = async (e) => {
    e.preventDefault();

    // Log the token
  const token = JSON.parse(sessionStorage.getItem("token"));
  console.log("Token:", token);

    // Validation logic
    if (!email) {
      setEmailError("Please enter an email");
    } else if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please enter a password");
    } else if (password.length < 8) {
      setPasswordError("Password must be 8 or more characters");
    } else {
      setPasswordError("");
    }

    if (!confPassword) {
      setConfPasswordError("Please enter a password");
    } else if (confPassword !== password) {
      setConfPasswordError("Passwords do not match");
    } else if (password.length < 8) {
      setConfPasswordError("Password must be 8 or more characters");
    } else {
      setConfPasswordError("");
    }

    if (!firstname) {
      setFirstnameError("Please enter a firstname");
    } else {
      setFirstnameError("");
    }

    if (!lastname) {
      setLastnameError("Please enter a lastname");
    } else {
      setLastnameError("");
    }

    if (isTeacher && !phonenumber) {
      setPhonenumberError("Please enter a phonenumber");
    } else {
      setPhonenumberError("");
    }

    // Proceed if no validation errors
    if (
      !emailError &&
      !passwordError &&
      !confPasswordError &&
      !firstnameError &&
      !lastnameError &&
      EMAIL_REGEX.test(email) &&
      password.length >= 8 &&
      (!isTeacher || !phonenumberError)
    ) {
      try {
        const user = { email, password, firstname, lastname, phonenumber };
        const data = await signUpUser(user, isTeacher);
        console.log("Signing up with user:", user); 
        console.log("Signing up with user:", user); 
        if (data && data.status === "success") {
          setSignUp(false);
          alert("Account created successfully");
        } else if (data && data.status === "failure" && data.reason === "ER_DUP_ENTRY") {
          setError("This user already exists");
        } else {
          setError("Could not create user");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <h1>Sign up</h1>
      {error && <div className={styles.error}>{error}</div>}

      <CustomInput name="email" placeholder="email" setValue={setEmail} error={emailError} />
      <CustomInput password name="password" placeholder="password" setValue={setPassword} error={passwordError} />
      <CustomInput password name="confPassword" placeholder="confirm password" setValue={setConfPassword} error={confPasswordError} />
      <CustomInput name="firstname" placeholder="first name" setValue={setFirstname} error={firstnameError} />
      <CustomInput name="lastname" placeholder="last name" setValue={setLastname} error={lastnameError} />
      
      {isTeacher && (
        <>
          <CustomInput name="phonenumber" placeholder="phonenumber" setValue={setPhonenumber} error={phonenumberError} />
        </>
      )}
      
      <CustomButton type={1} text="Sign up" onClick={signUp} />
      <CustomButton type={2} text="Login" onClick={() => setSignUp(false)} />
    </>
  );
};

export default SignUpBox;
