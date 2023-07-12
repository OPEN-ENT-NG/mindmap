import { EmptyScreen } from "@ode-react-ui/components";
import { useOdeClient, useOdeTheme } from "@ode-react-ui/core";
import { useTranslation } from "react-i18next";

export default function EmptyScreenApp(): JSX.Element {
  const { appCode } = useOdeClient();
  const { theme } = useOdeTheme();
  const { t } = useTranslation();

  return (
    <EmptyScreen
      imageSrc={`${theme?.bootstrapPath}/images/emptyscreen/illu-${appCode}.svg`}
      imageAlt={t("explorer.emptyScreen.app.alt")}
      title={t("explorer.emptyScreen.blog.title.create")}
      text={"Oops"}
    />
  );
}