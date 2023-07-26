import { createBrowserRouter } from "react-router-dom";

import Root from "~/app/root";
import { Index, indexLoader } from "~/app/temp";
import ErrorPage from "~/shared/components/ErrorPage";

const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index />,
        loader: indexLoader,
        errorElement: <ErrorPage />,
      },
      /* {
        path: "view/:mapId",
        async lazy() {
          const { mapLoader, Mindmap } = await import("../app/mindmap");
          return {
            loader: mapLoader,
            Component: Mindmap,
          };
        },
        errorElement: <ErrorPage />,
      }, */
    ],
  },
  {
    path: "id/:id",
    async lazy() {
      const { mapLoader, Mindmap } = await import("../app/mindmap");
      return {
        loader: mapLoader,
        Component: Mindmap,
      };
    },
    errorElement: <ErrorPage />,
  },
];

export const router = createBrowserRouter(routes, {
  // basename: "/mindmap",
});
