import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

it("renders without crashing ", () => {
  const { queryAllByTestId, getByRole } = render(<App />);
  const login = queryAllByTestId("thelogin");
  //   const login = getByRole("heading", { name: /login/i });
  expect(login).toBeTruthy();
});

describe("Login", () => {
  const {
    queryByTestId,
    queryByPlaceholderText,
    queryAllByTestId,
    getAllByText,
  } = render(<App />, { wrapper: MemoryRouter });
  const inputEmail = queryByPlaceholderText("email");
  const inputPassword = queryByPlaceholderText("password");

  fireEvent.change(inputEmail, { target: { value: "email20@email.com" } });
  expect(inputEmail.value).toBe("email20@email.com");
  fireEvent.change(inputPassword, { target: { value: "password" } });
  expect(inputPassword.value).toBe("password");

  const btn = getAllByText("Login");
  //   console.log("this", btn.length);
  fireEvent.click(btn[1]);

  // const usersName = queryByTestId("firstlast");
  //   const usersName = screen.getByText(/first last/i);

  //   console.log("this", usersName);
});
