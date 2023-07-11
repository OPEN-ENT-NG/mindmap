import { LoadingScreen, Layout } from "@ode-react-ui/components";
import { useOdeClient } from "@ode-react-ui/core";
import { Outlet } from "react-router-dom";

function Root() {
  const { init } = useOdeClient();

  if (!init) return <LoadingScreen position={false} />;

  return init ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : null;
}

export default Root;
