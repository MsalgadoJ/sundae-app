import { RenderOptions, render } from '@testing-library/react';
import { OrderDetailsProvider } from '../contexts/OrderDetails';
import { ReactElement } from 'react';

const renderWithContext = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: OrderDetailsProvider, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { renderWithContext as render };
