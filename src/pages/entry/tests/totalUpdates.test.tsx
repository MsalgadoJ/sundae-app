import { test, expect, describe } from 'vitest';
import { render, screen } from '@/test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Options from '../Options';
import OrderEntry from '../OrderEntry';

test('update scoop subtotal when scoops change', async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });
  expect(scoopsSubtotal).toHaveTextContent('0.00');

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '1');
  expect(scoopsSubtotal).toHaveTextContent('2.00');

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, '2');
  expect(scoopsSubtotal).toHaveTextContent('6.00');
});

test('update toppings subtotal when toppings update', async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  // make sure total starts out $0.00
  const toppingsSubtotal = screen.getByText('Toppings total: $', {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent('0.00');

  // check Cherries topping and check the subtotal
  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: /cherries/i,
  });

  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('1.50');

  // check another box to check if it can handle more options
  const hotFudgeCheckbox = await screen.findByRole('checkbox', {
    name: /hot fudge/i,
  });

  await user.click(hotFudgeCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('3.00');

  // uncheck one of the selected boxes
  await user.click(cherriesCheckbox);
  expect(toppingsSubtotal).toHaveTextContent('1.50');
});

describe('grand total', () => {
  test('grand total starts at $0.00', () => {
    const { unmount } = render(<OrderEntry />);

    const grandTotal = screen.getByRole('heading', {
      name: /grand total/i,
    });
    expect(grandTotal).toHaveTextContent('0.00');

    unmount();
  });

  test('grand total updates properly if scoop is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = screen.getByRole('heading', {
      name: /grand total/i,
    });

    // add scoops
    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla',
    });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, '2');
    expect(grandTotal).toHaveTextContent('4.00');

    // add toppings
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: /cherries/i,
    });

    await user.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent('5.50');
  });

  test('grand total updates properly if topping is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = await screen.findByRole('heading', {
      name: /grand total/i,
    });

    // add toppings
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: /cherries/i,
    });

    await user.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent('1.50');

    // add scoops
    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla',
    });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, '2');
    expect(grandTotal).toHaveTextContent('5.50');
  });

  test('grand total updates properly item is removed', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const grandTotal = await screen.findByRole('heading', {
      name: /grand total/i,
    });

    // add toppings
    const cherriesCheckbox = await screen.findByRole('checkbox', {
      name: /cherries/i,
    });
    await user.click(cherriesCheckbox);

    // add scoops
    const vanillaInput = await screen.findByRole('spinbutton', {
      name: 'Vanilla',
    });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, '2');

    // remove one scoop
    await user.clear(vanillaInput);
    await user.type(vanillaInput, '1');
    expect(grandTotal).toHaveTextContent('3.50');

    // remove cherries
    await user.click(cherriesCheckbox);
    expect(grandTotal).toHaveTextContent('2.00');
  });
});
