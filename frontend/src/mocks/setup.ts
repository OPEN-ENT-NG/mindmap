/**
 * DO NOT MODIFY
 */

import '@testing-library/jest-dom/vitest';
import { RenderOptions, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import '../i18n';
import { CustomProviders } from './providers';
import { server } from './server';

// Enable API mocking before tests.
beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'bypass',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Modals are rendered through a portal (see ExportModal)
beforeEach(() => {
  if (!document.getElementById('portal')) {
    const portal = document.createElement('div');
    portal.id = 'portal';
    document.body.appendChild(portal);
  }
});

const user = userEvent.setup();

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult & { user: typeof user } => {
  return {
    user,
    ...render(ui, { wrapper: CustomProviders, ...options }),
  };
};

export const wrapper = CustomProviders;
export * from '@testing-library/react';
export { customRender as render };
