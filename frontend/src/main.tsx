import React from 'react';

import { EdificeClientProvider, EdificeThemeProvider } from '@edifice.io/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './i18n';

import '@edifice.io/bootstrap/dist/index.css';
import { router } from './routes';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, root, 1000);
  });
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (error === '0090') window.location.replace('/auth/login');
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <EdificeClientProvider
      params={{
        app: 'mindmap',
      }}
    >
      <EdificeThemeProvider>
        <RouterProvider router={router} />
      </EdificeThemeProvider>
    </EdificeClientProvider>
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
  </QueryClientProvider>,
);
