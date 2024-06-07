import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import StudentProfile from "./StudentProfile";
import { MemoryRouter } from "react-router-dom";
import { deleteStudent } from "../http_Requests/StudentRequests/StudentRequests";
import { loginUser, signUpUser } from "../http_Requests/userRequests";

it("renders without crashing ", () => {
  const { queryByTestId } = render(<StudentProfile setToken={() => {}} />, {
    wrapper: MemoryRouter,
  });
  const login = queryByTestId("studentProfile");
  expect(login).toBeTruthy();
});
