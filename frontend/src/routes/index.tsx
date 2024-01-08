import { Explorer } from "@edifice-ui/explorer";
import { createBrowserRouter } from "react-router-dom";

import Root from "~/app/root";
import { explorerConfig } from "~/config/config";
import PageError from "~/routes/page-error";

import "~/styles/index.css";

const routes = [
  {
    path: "/",
    element: <Root />,
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
