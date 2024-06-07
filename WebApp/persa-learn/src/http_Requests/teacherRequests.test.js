import { updateUserDetails } from "./studentRequests";
import { deleteStudent } from "./StudentRequests/StudentRequests";
import {
  createClass,
  deleteClass,
  deleteTeacher,
  editTeachers,
  getTeachersClasses,
  getTeachersDetails,
  updateClass,
} from "./teacherRequests";
import { loginUser, signUpUser } from "./userRequests";

describe("teacherRequests", () => {
  beforeAll(async () => {
    // create account
    let results = await signUpUser(
      {
        email: "email@testing.test",
        password: "password",
        firstname: "first",
        lastname: "last",
        phonenumber: "0123432",
      },
      true
    );
    expect(results.status).toBe("success");
    //login to account just created
    let data = await loginUser(
      { email: "email@testing.test", password: "password" },
      true,
      false
    );
    expect(data.status).toBe("success");
    sessionStorage.setItem("token", JSON.stringify(data.token));
  });

  afterAll(async () => {
    // delete the account to allow for test to be repeated
    const results = await deleteTeacher();
    expect(results.status).toBe("success");
  });

  test("getTeacherDetails", async () => {
    const result = await getTeachersDetails();
    expect(result.status).toBe("success");
    expect(result.details.email).toBe("email@testing.test");
    expect(result.details.FirstName).toBe("first");
    expect(result.details.LastName).toBe("last");
  });

  test("updateUserDetails", async () => {
    let result = await getTeachersDetails();
    expect(result.status).toBe("success");
    expect(result.details.email).toBe("email@testing.test");
    expect(result.details.FirstName).toBe("first");
    expect(result.details.LastName).toBe("last");
    result = await editTeachers({
      email: "email@testing.test",
      password: "password",
      firstname: "first2",
      lastname: "last2",
      phonenumber: "0123432",
    });
    expect(result.status).toBe("success");

    result = await getTeachersDetails();
    expect(result.status).toBe("success");
    expect(result.details.email).toBe("email@testing.test");
    expect(result.details.FirstName).toBe("first2");
    expect(result.details.LastName).toBe("last2");
  });
});

describe("ClassRequests", () => {
  beforeAll(async () => {
    let results = await signUpUser(
      {
        email: "email@testing.test",
        password: "password",
        firstname: "first",
        lastname: "last",
        phonenumber: "0123432",
      },
      true
    );
    expect(results.status).toBe("success");

    let data = await loginUser(
      { email: "email@testing.test", password: "password" },
      true,
      false
    );
    expect(data.status).toBe("success");
    sessionStorage.setItem("token", JSON.stringify(data.token));
  });

  afterAll(async () => {
    const results = await deleteTeacher();
    expect(results.status).toBe("success");
  });

  test("getClasses", async () => {
    let results = await getTeachersClasses();
    expect(results.data.constructor).toBe(Array);
  });

  test("createClasses", async () => {
    let results = await getTeachersClasses();
    expect(results.data.constructor).toBe(Array);
    const num = results.data.length;
    results = await createClass({ name: "test", year: 1 });
    expect(results.status).toBe("success");
    results = await getTeachersClasses();
    expect(results.data.constructor).toBe(Array);
    expect(results.data.length).toBe(num + 1);
  });

  test("updateClasses", async () => {
    let results = await createClass({ name: "test", year: 1 });
    results = await getTeachersClasses();
    expect(results.data.constructor).toBe(Array);
    const id = results.data[0].classdetailsID;

    results = await updateClass({
      classID: id,
      name: "test",
      year: 1,
    });
    expect(results.status).toBe("success");
  });

  test("deleteClasses", async () => {
    let results = await createClass({ name: "test", year: 1 });
    results = await getTeachersClasses();
    expect(results.data.constructor).toBe(Array);
    const id = results.data[0].classdetailsID;

    results = await deleteClass({ classID: id });

    expect(results.status).toBe("success");
  });
});
