import { test, expect, vi } from "vitest";
import { render, screen } from "@/test-utils/testing-library-utils";
import { HttpResponse, http } from "msw";
import { server } from "@/mocks/server";
import OrderEntry from "../OrderEntry";
import userEvent from "@testing-library/user-event";

test.skip("handles error for scoops and toppings routes", async () => {
  server.resetHandlers(
    http.get("http://localhost:3030/scoops", () => {
      return new HttpResponse(null, { status: 500 });
    }),
    http.get("http://localhost:3030/toppings", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<OrderEntry setOrderPhase={vi.fn()} />);

  const alerts = await screen.findAllByRole("alert");
  expect(alerts).toHaveLength(2);
});

test("order button should be disabled if there are no scoops selected", async () => {
  const user = userEvent.setup();

  render(<OrderEntry setOrderPhase={vi.fn()} />);

  // check initial conditions: button should be disabled
  const orderButton = screen.getByRole("button", { name: /order/i });

  // add a scoop and check button is enabled
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  expect(orderButton).toBeEnabled();

  // undo scoops and check button is disabled again
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "0");
  expect(orderButton).toBeDisabled();
});
