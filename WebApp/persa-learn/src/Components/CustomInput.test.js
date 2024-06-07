import { render, screen, fireEvent } from "@testing-library/react";
import CustomInput from "./CustomInput";
import React from "react";

it("renders without crashing ", () => {
  const { queryByTestId } = render(<CustomInput />);
  const input = queryByTestId("input");
  expect(input).toBeTruthy();
});
