import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";

it("renders without crashing ", () => {
  // render navbar
  const { queryByTestId } = render(<Navbar />, { wrapper: MemoryRouter });

  //check bar rendered
  const navbar = queryByTestId("navbar");
  expect(navbar).toBeTruthy();
});

describe("all views render", () => {
  it("renders student view correctly", () => {
    // enter student items in session storage
    sessionStorage.setItem("teacher", false);
    sessionStorage.setItem("admin", false);
    // render navbar
    const { queryByTestId } = render(<Navbar />, { wrapper: MemoryRouter });

    // check bar rendered
    const navbar = queryByTestId("navbar");
    expect(navbar).toBeTruthy();

    // ensure correct values are displayed
    screen.getByText(/Home/i);
    screen.getByText(/classes/i);
    screen.getByText(/Revision/i);
    screen.getByText(/Shop/i);
    screen.getByText(/logout/i);
  });

  it("renders teacher view correctly", () => {
    // enter teacher items in session storage
    sessionStorage.setItem("teacher", true);
    sessionStorage.setItem("admin", false);

    // render navbar
    const { queryByTestId } = render(<Navbar />, { wrapper: MemoryRouter });

    // check bar rendered
    const navbar = queryByTestId("navbar");
    expect(navbar).toBeTruthy();

    // ensure correct values are displayed
    screen.getByText(/Home/i);
    screen.getByText(/Classes/i);
    screen.getByText(/Profile/i);
    screen.getByText(/logout/i);
  });
  it("renders admin view correctly", () => {
    sessionStorage.setItem("teacher", false);
    sessionStorage.setItem("admin", true);

    // render navbar
    const { queryByTestId } = render(<Navbar />, { wrapper: MemoryRouter });
    const navbar = queryByTestId("navbar");
    expect(navbar).toBeTruthy();

    screen.getByText(/Home/i);
    screen.getByText(/Shop/i);
    screen.getByText(/Profile/i);
    screen.getByText(/logout/i);
  });
});
