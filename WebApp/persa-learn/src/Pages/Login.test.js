import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Login from "./Login";

it("renders without crashing ", () => {
  const { queryByTestId } = render(<Login setToken={() => {}} />);
  const login = queryByTestId("login");
  expect(login).toBeTruthy();
});
it("renders login screen without crashing ", () => {
  const { queryByTestId, queryByPlaceholderText } = render(
    <Login setToken={() => {}} />
  );
  const login = queryByTestId("login");
  expect(login).toBeTruthy();
  const emailInput = queryByPlaceholderText("email");
  expect(emailInput).toBeTruthy();
  const inputPassword = queryByPlaceholderText("password");
  expect(inputPassword).toBeTruthy();
});
describe("clickButton", () => {
  it("onClickSignUp", () => {
    const { queryByText, queryByPlaceholderText } = render(
      <Login setToken={() => {}} />
    );
    const btn = queryByText(/Sign Up/i);

    fireEvent.click(btn);
    const inputEmail = queryByPlaceholderText("email");
    expect(inputEmail).toBeTruthy();
    const inputPassword = queryByPlaceholderText("password");
    expect(inputPassword).toBeTruthy();
    const inputConPass = queryByPlaceholderText("confPassword");
    expect(inputConPass).toBeTruthy();
    const inputFirstname = queryByPlaceholderText("firstname");
    expect(inputFirstname).toBeTruthy();
    const inputLastname = queryByPlaceholderText("lastname");
    expect(inputLastname).toBeTruthy();
    // const inputPhonenumber = queryByPlaceholderText("phonenumber");
    // expect(inputPhonenumber).toBeTruthy();

    // expect(consoleSpy).toHaveBeenCalledWith("worked");
  });

  it("onClickAdmin", () => {
    const { queryByText, queryByPlaceholderText } = render(
      <Login setToken={() => {}} />
    );
    const btn = queryByText(/Admin Login/i);

    fireEvent.click(btn);
    const inputEmail = queryByPlaceholderText("email");
    expect(inputEmail).toBeTruthy();
    const inputPassword = queryByPlaceholderText("password");
    expect(inputPassword).toBeTruthy();

    const btnSignUp = queryByText(/Sign Up/i);
    expect(btnSignUp).toBeFalsy();
  });
});
describe("login form", () => {
  it("can enter values login form", () => {
    const { queryByText, queryByPlaceholderText } = render(
      <Login setToken={() => {}} />
    );
    const inputWord = "testing";
    const inputEmail = queryByPlaceholderText("email");
    expect(inputEmail).toBeTruthy();
    const inputPassword = queryByPlaceholderText("password");
    expect(inputPassword).toBeTruthy();
    fireEvent.change(inputEmail, { target: { value: inputWord } });
    expect(inputEmail.value).toBe(inputWord);
    fireEvent.change(inputPassword, { target: { value: inputWord } });
    expect(inputPassword.value).toBe(inputWord);
  });

  it("Error messages show", () => {
    const {
      queryByText,
      queryByPlaceholderText,
      queryByTestId,
      queryAllByTestId,
    } = render(<Login setToken={() => {}} />);
    const inputEmail = queryByPlaceholderText("email");
    expect(inputEmail).toBeTruthy();
    const inputPassword = queryByPlaceholderText("password");
    expect(inputPassword).toBeTruthy();

    fireEvent.change(inputEmail, { target: { value: "" } });
    expect(inputEmail.value).toBe("");
    fireEvent.change(inputPassword, { target: { value: "" } });
    expect(inputPassword.value).toBe("");

    const btn = queryAllByTestId("button");
    fireEvent.click(btn[0]);

    const errorEmail = queryByText(/Please enter an email/i);
    expect(errorEmail).toBeTruthy();

    const errorPassword = queryByText("Please enter a password");
    expect(errorPassword).toBeTruthy();
  });

  it("Error messages show password error", () => {
    const {
      queryByText,
      queryByPlaceholderText,
      queryByTestId,
      queryAllByTestId,
    } = render(<Login setToken={() => {}} />);
    const inputEmail = queryByPlaceholderText("email");
    expect(inputEmail).toBeTruthy();
    const inputPassword = queryByPlaceholderText("password");
    expect(inputPassword).toBeTruthy();

    fireEvent.change(inputEmail, { target: { value: "email@email.com" } });
    expect(inputEmail.value).toBe("email@email.com");
    fireEvent.change(inputPassword, { target: { value: "pasasd" } });
    expect(inputPassword.value).toBe("pasasd");

    const btn = queryAllByTestId("button");
    fireEvent.click(btn[0]);

    let errorEmail = queryByText(/Please enter an email/i);
    expect(errorEmail).toBeFalsy();
    errorEmail = queryByText(/Please enter a valid email/i);
    expect(errorEmail).toBeFalsy();

    const errorPassword = queryByText("Password must be 8 or more characters");
    expect(errorPassword).toBeTruthy();
  });

  it("Error messages show email error", () => {
    const {
      queryByText,
      queryByPlaceholderText,
      queryByTestId,
      queryAllByTestId,
    } = render(<Login setToken={() => {}} />);
    const inputEmail = queryByPlaceholderText("email");
    expect(inputEmail).toBeTruthy();
    const inputPassword = queryByPlaceholderText("password");
    expect(inputPassword).toBeTruthy();

    fireEvent.change(inputEmail, { target: { value: "email.com" } });
    expect(inputEmail.value).toBe("email.com");
    fireEvent.change(inputPassword, { target: { value: "pasasdword" } });
    expect(inputPassword.value).toBe("pasasdword");

    const btn = queryAllByTestId("button");
    fireEvent.click(btn[0]);

    const errorEmail = queryByText(/Please enter a valid email/i);
    expect(errorEmail).toBeTruthy();

    let errorPassword = queryByText("Password must be 8 or more characters");
    expect(errorPassword).toBeFalsy();
    errorPassword = queryByText("Please enter a password");
    expect(errorPassword).toBeFalsy();
  });
});
