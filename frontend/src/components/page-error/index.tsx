import { AppHeader, Button, Heading, Layout } from "@edifice-ui/react";
import { t } from "i18next";
import { useRouteError } from "react-router-dom";

export default function PageError() {
  const error = useRouteError();
  console.error(error);

  return (
    <Layout>
      <AppHeader render={() => <></>}>
        <div className="container-fluid mt-64 mb-64">
          <div className="d-flex flex-column gap-16 align-items-center">
            <Heading level="h2" headingStyle="h2" className="text-secondary">
              {t("oops")}
            </Heading>
            <div className="text">
              {" "}
              {t("mindmap.or.page.notfound.or.unauthorized", { ns: "mindmap" })}
            </div>
            <Button
              color="primary"
              onClick={() => {
                window.location.href = "/mindmap";
              }}
            >
              {t("back")}
            </Button>
          </div>
        </div>
      </AppHeader>
    </Layout>
  );
}
