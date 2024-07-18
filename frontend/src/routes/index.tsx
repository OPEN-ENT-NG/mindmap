import { Explorer } from "ode-explorer/lib";
import { RouteObject, createBrowserRouter } from "react-router-dom";
import { explorerConfig } from "~/config";

import PageError from "~/routes/page-error";

import "~/styles/index.css";

const routes: RouteObject[] = [
  {
    path: "/*",
    async lazy() {
      const { loader, Root: Component } = await import("~/routes/root");
      return {
        loader,
        Component,
      };
    },
    errorElement: <PageError />,
    children: [
      {
        index: true,
        element: <Explorer config={explorerConfig} />,
      },
    ],
  },
  {
    path: "id/:id",
    async lazy() {
      const { loader, Mindmap } = await import("./mindmap");
      return {
        loader,
        Component: Mindmap,
      };
    },
    errorElement: <PageError />,
  },
  {
    path: "print/id/:id",
    async lazy() {
      const { loader, Mindmap } = await import("./print");
      return {
        loader,
        Component: Mindmap,
      };
    },
    errorElement: <PageError />,
  },
];

export const basename = import.meta.env.PROD ? "/mindmap" : "/";

export const router = createBrowserRouter(routes, {
  basename,
});
