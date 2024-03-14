import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '@/App';

test('order phases for happy pahth', async () => {
  const user = userEvent.setup();
  // render app
  render(<App />);

  // add ice cream scoops
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '1');

  // add toppings
  const cherriesTopping = await screen.findByRole('checkbox', {
    name: /cherries/i,
  });

  await user.click(cherriesTopping);

  // find and click order button
  const orderButton = screen.getByRole('button', { name: /order/i });
  await user.click(orderButton);

  // check summary information based on order
  const summaryHeading = screen.getByRole('heading', { name: 'Order Summary' });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsTotal = screen.getByRole('heading', { name: 'Scoops: $2.00' });
  expect(scoopsTotal).toBeInTheDocument();

  const toppingsTotal = screen.getByRole('heading', {
    name: 'Toppings: $1.50',
  });
  expect(toppingsTotal).toBeInTheDocument();

  // check summary option items
  expect(screen.getByText('1 Vanilla')).toBeInTheDocument();
  expect(screen.getByText('Cherries')).toBeInTheDocument();

  // accept terms and conditions and click button to confirm order
  const termsAndConditionsCheckbox = screen.getByRole('checkbox', {
    name: /i agree to terms and conditions/i,
  });
  await user.click(termsAndConditionsCheckbox);

  const confirmButton = screen.getByRole('button', { name: /confirm order/i });
  await user.click(confirmButton);

  // Expect "loading" to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // confirm order number on confirmation page
  const thankyouHeading = await screen.findByRole('heading', {
    name: /thank you/i,
  });
  expect(thankyouHeading).toBeInTheDocument();

  // loading has disappeared
  const notLoading = screen.queryByText('loading');
  expect(notLoading).not.toBeInTheDocument();

  const orderConfirmation = await screen.findByText('your order number is', {
    exact: false,
  });
  expect(orderConfirmation).toHaveTextContent('123456');

  // click new order button on confirmation page
  const newOrderButton = screen.getByRole('button', {
    name: /create new order/i,
  });
  await user.click(newOrderButton);

  // check that the scoops and toppings subtotals have been reset
  const resetScoops = screen.getByText('Scoops total: $', { exact: false });
  const resetToppings = screen.getByText('Toppings total: $', { exact: false });

  expect(resetScoops).toHaveTextContent('0.00');
  expect(resetToppings).toHaveTextContent('0.00');
});
