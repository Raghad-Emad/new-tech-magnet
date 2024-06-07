import { updateUserDetails } from "./studentRequests";
import { deleteStudent } from "./StudentRequests/StudentRequests";
import { loginUser, signUpUser } from "./userRequests";

describe("studentRequests", () => {
  beforeAll(async () => {
    let results = await signUpUser(
      {
        email: "email@testing.test",
        password: "password",
        firstname: "first",
        lastname: "last",
      },
      false
    );
    expect(results.status).toBe("success");

    let data = await loginUser(
      { email: "email@testing.test", password: "password" },
      false,
      false
    );
    // console.log(data);
    expect(data.status).toBe("success");
    sessionStorage.setItem("token", JSON.stringify(data.token));
  });

  afterAll(async () => {
    const results = await deleteStudent();
    expect(results.status).toBe("success");
  });

  test("updateUserDetails", async () => {
    const result = await updateUserDetails({
      email: "email@testing.test",
      password: "password",
      firstname: "first2",
      lastname: "last2",
    });
    expect(result.status).toBe("success");
  });
});
