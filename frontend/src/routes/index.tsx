import { createBrowserRouter } from "react-router-dom";

import PageError from "~/routes/page-error";

import "~/styles/index.css";

const routes = [
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
