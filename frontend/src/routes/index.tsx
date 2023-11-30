import { createBrowserRouter } from "react-router-dom";

import ErrorPage from "~/routes/page-error";
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
    errorElement: <ErrorPage />,
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
    errorElement: <ErrorPage />,
  },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.PROD ? "/mindmap" : "/",
});
