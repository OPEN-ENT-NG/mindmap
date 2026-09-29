import { ReactNode, useState } from 'react';

import { EdificeClientProvider, EdificeThemeContext } from '@edifice.io/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Test providers, mirroring those of main.tsx
 * - a fresh QueryClient per render, so no cache leaks between tests
 * - a mocked theme context instead of EdificeThemeProvider (avoids fetching the theme conf)
 */
export const CustomProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      }),
  );

  const themeContextValue = {
    theme: 'default',
    setTheme: vi.fn(),
  } as any;

  return (
    <QueryClientProvider client={queryClient}>
      <EdificeClientProvider params={{ app: 'mindmap' }}>
        <EdificeThemeContext.Provider value={themeContextValue}>
          {children}
        </EdificeThemeContext.Provider>
      </EdificeClientProvider>
    </QueryClientProvider>
  );
};
