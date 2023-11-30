import { Button, EmptyScreen, Layout, usePaths } from "@edifice-ui/react";
import { useTranslation } from "react-i18next";
import { useRouteError } from "react-router-dom";

export default function PageError() {
  const error = useRouteError();
  console.error(error);

  const { t } = useTranslation();

  const [imagePath] = usePaths();

  return (
    <Layout>
      <div className="d-flex flex-column gap-16 align-items-center mt-64">
        <EmptyScreen
          imageSrc={`${imagePath}/emptyscreen/illu-error.svg`}
          imageAlt={t("explorer.emptyScreen.error.alt")}
          title={t("oops")}
          text={t("mindmap.or.page.notfound.or.unauthorized", {
            ns: "mindmap",
          })}
        />
        <Button
          color="primary"
          onClick={() => {
            window.location.href = "/mindmap";
          }}
        >
          {t("back")}
        </Button>
      </div>
    </Layout>
  );
}
