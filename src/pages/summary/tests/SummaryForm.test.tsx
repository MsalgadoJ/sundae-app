import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SummaryForm from "../SummaryForm";
import userEvent from "@testing-library/user-event";

test("Summary form initial conditions", () => {
  render(<SummaryForm />);
  // find elements
  const checkboxElement = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const buttonElement = screen.getByRole("button", { name: /confirm order/i });
  // should be unchecked by default
  expect(checkboxElement).not.toBeChecked();
  expect(buttonElement).toBeDisabled();
});

test("Checkbox enables button on first click and disables button on second click", async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);
  // find elements
  const checkboxElement = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const buttonElement = screen.getByRole("button", { name: /confirm order/i });
  // checking checkbox enables button
  await user.click(checkboxElement);
  expect(buttonElement).toBeEnabled();
  //checking checkbox again disables button
  await user.click(checkboxElement);
  expect(buttonElement).toBeDisabled();
});

test("popover responds to hover", async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);

  // popover starts out hidden
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();

  // popover appears on mouseover of checkbox label
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  await user.hover(termsAndConditions);
  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  // popover disappears when we mouse out
  await user.unhover(termsAndConditions);
  expect(popover).not.toBeInTheDocument();
});
