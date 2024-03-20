import { test, expect } from "vitest";
import { render, screen } from "@/test-utils/testing-library-utils";
import Options from "../Options";
import userEvent from "@testing-library/user-event";

test("displays image for each scoop option from server", async () => {
  render(<Options optionType="scoops" />);

  // find images
  const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2);

  // confirm alt text of images
  // @ts-ignore
  const altText = scoopImages.map((element) => element.alt);
  expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});

test("scoops total wont update for invalid input", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // find and update scoop count to invalid number: lower than zero
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: /vanilla/i,
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "-1");

  // check total hasn't been updated
  const scoopsTotal = screen.getByText(/scoops total/i);
  expect(scoopsTotal).toHaveTextContent("$0.00");

  // update scoop count to invalid number: decimal value
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "2.5");

  // check total hasn't been updated
  expect(scoopsTotal).toHaveTextContent("$0.00");

  // update scoop count to invalid number: higher than 10
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "11");

  // check total hasn't been updated
  expect(scoopsTotal).toHaveTextContent("$0.00");

  // check total updates with valid inputs
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  expect(scoopsTotal).toHaveTextContent("$2.00");
});

test("displays image for each topping from server", async () => {
  render(<Options optionType="toppings" />);

  // find images
  const toppingImages = await screen.findAllByRole("img", {
    name: /topping$/i,
  });
  expect(toppingImages).toHaveLength(3);

  // confirm alt text of images
  // @ts-ignore
  const altText = toppingImages.map((el) => el.alt);
  expect(altText).toEqual([
    "Cherries topping",
    "M&Ms topping",
    "Hot fudge topping",
  ]);
});
