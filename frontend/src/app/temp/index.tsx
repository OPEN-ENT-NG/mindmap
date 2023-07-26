import { Card } from "@ode-react-ui/components";
import { useOdeClient, useUser } from "@ode-react-ui/core";
import { useTranslation } from "react-i18next";
import { useLoaderData, useNavigate } from "react-router-dom";

import { MindmapProps } from "../mindmap";

export async function indexLoader() {
  const list = await fetch(`/mindmap/list/all`);
  return list.json() as Promise<MindmapProps[]>;
}

export const Index = () => {
  const data = useLoaderData() as MindmapProps[];
  const navigate = useNavigate();
  const { appCode } = useOdeClient();
  const { user } = useUser();
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("welcome", { username: user?.username })}</h1>
      <h2>{t("mindmap.title", { ns: appCode })}</h2>
      {data.map((item) => {
        return (
          <Card
            key={item._id}
            name={item.name}
            onOpen={() => navigate(`id/${item._id}`)}
          />
        );
      })}
    </>
  );
};
