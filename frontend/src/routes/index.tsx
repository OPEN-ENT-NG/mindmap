import { Explorer } from "ode-explorer/lib";
import { RouteObject, createBrowserRouter } from "react-router-dom";

import { explorerConfig } from "~/config/config";
import PageError from "~/routes/page-error";
import Root from "~/routes/root";

import "~/styles/index.css";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        // @ts-ignore
        element: <Explorer config={explorerConfig} />,
      },
    ],
  },
  {
    path: "id/:id",
    async lazy() {
      const { mapLoader, Mindmap } = await import("./mindmap");
      return {
        loader: mapLoader,
        Component: Mindmap,
      };
    },
    errorElement: <PageError />,
  },
  {
    path: "print/id/:id",
    async lazy() {
      const { mapLoader, Mindmap } = await import("./print");
      return {
        loader: mapLoader,
        Component: Mindmap,
      };
    },
    errorElement: <PageError />,
  },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.PROD ? "/mindmap" : "/",
});
