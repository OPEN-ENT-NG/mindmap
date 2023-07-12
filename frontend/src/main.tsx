import React from "react";

import "./i18n";
import { OdeClientProvider } from "@ode-react-ui/core";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "~/app/root";
import { Index, indexLoader } from "~/app/temp";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line global-require
  import("@axe-core/react").then((axe) => {
    axe.default(React, root, 1000);
  });
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error === "0090") window.location.replace("/auth/login");
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    loader: indexLoader,
  },
  {
    element: <Root />,
    children: [
      {
        index: true,
        path: "id/:mapId",
        async lazy() {
          const { mapLoader, Mindmap } = await import("./app/mindmap");
          return {
            loader: mapLoader,
            Component: Mindmap,
          };
        },
      },
    ],
  },
]);

root.render(
  <QueryClientProvider client={queryClient}>
    <OdeClientProvider
      params={{
        app: "mindmap",
      }}
    >
      <RouterProvider router={router} />
    </OdeClientProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
