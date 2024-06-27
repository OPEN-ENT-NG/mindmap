import { Layout, LoadingScreen } from "@edifice-ui/react";
import { Outlet } from "react-router-dom";

import { useMindmapRedirect } from "~/hooks/useMindmapRedirect";

function Root() {
  const isLoading = useMindmapRedirect();

  if (isLoading) return <LoadingScreen position={false} />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default Root;
