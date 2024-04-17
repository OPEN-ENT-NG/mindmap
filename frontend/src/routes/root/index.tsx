import { LoadingScreen, Layout, useOdeClient } from "@edifice-ui/react";
import { Outlet } from "react-router-dom";

function Root() {
  const { init } = useOdeClient();

  if (!init) return <LoadingScreen position={false} />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default Root;
