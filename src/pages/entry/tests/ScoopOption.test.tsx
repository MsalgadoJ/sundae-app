import { test, expect } from "vitest";
import { render, screen } from "@/test-utils/testing-library-utils";
import ScoopOption from "../ScoopOption";
import userEvent from "@testing-library/user-event";

test("box turns red when invalid input", async () => {
  const user = userEvent.setup();
  render(
    <ScoopOption name={"Chocolate"} imagePath={"/images/chocolate.png"} />
  );

  // find and update number of scoop to: lower than zero
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: /Chocolate/i,
  });

  await user.clear(chocolateInput);
  await user.type(chocolateInput, "-1");

  // check box has turned red
  expect(chocolateInput).toHaveClass("is-invalid");

  // update number of scoop to:  decimal values
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "1.5");
  expect(chocolateInput).toHaveClass("is-invalid");

  // update number of scoop to:  higher than ten
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "15");
  expect(chocolateInput).toHaveClass("is-invalid");

  // update to a valid number and check the invalid class is not there
  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");
  expect(chocolateInput).not.toHaveClass("is-invalid");
});
