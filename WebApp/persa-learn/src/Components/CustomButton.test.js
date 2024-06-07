import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomButton from "./CustomButton";

it("renders without crashing", () => {
  const { queryByTestId } = render(<CustomButton text={"learn react"} />);
  const btn = queryByTestId("button");
  expect(btn).toBeTruthy();
});

describe("clickButton", () => {
  it("onClick", () => {
    // monitor console
    const consoleSpy = jest.spyOn(console, "log");
    // render button with test function
    const { queryByTestId } = render(
      <CustomButton
        text={"learn react"}
        onClick={() => console.log("worked")}
      />
    );
    // click button
    const btn = queryByTestId("button");
    fireEvent.click(btn);
    // check expected result
    expect(consoleSpy).toHaveBeenCalledWith("worked");
  });
});
