import { Button } from "@ode-react-ui/components";
import { useOdeClient } from "@ode-react-ui/core";
import { useTranslation } from "react-i18next";

export const AppAction = () => {
  const { appCode } = useOdeClient();
  const { t } = useTranslation();

  return (
    <>
      <Button type="button" color="primary" variant="filled" className="ms-4">
        {t("mindmap.export", { ns: appCode })}
      </Button>
      <Button type="button" color="primary" variant="filled" className="ms-4">
        {t("mindmap.save", { ns: appCode })}
      </Button>
    </>
  );
};
