import { test, expect, vi } from "vitest";
import { render, screen } from "@/test-utils/testing-library-utils";
import { server } from "@/mocks/server";
import { HttpResponse, http } from "msw";
import OrderConfirmation from "../OrderConfirmation";

test("show alert for error when submiting a order", async () => {
  server.resetHandlers(
    http.get("http://localhost:3030/order", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<OrderConfirmation setOrderPhase={vi.fn()} />);

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(
    "An unexpected error occurred. Please try again later."
  );
});
