import { useState } from "react";

// @ts-ignore
import Editor from "@edifice-wisemapping/editor";
import { Breadcrumb, Button } from "@ode-react-ui/components";
import { useOdeClient } from "@ode-react-ui/core";
import { ID } from "ode-ts-client";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";

import ExportModal from "~/features/export-modal";
import { mapInfo, persistenceManager } from "~/features/mindmap/configuration";
import "~/styles/index.css";
import { useActions } from "~/services/queries";

export interface MindmapProps {
  created: Date;
  description: string;
  map: string;
  modified: Date;
  name: string;
  owner: { userId: ID; displayName: string };
  shared: any[];
  thumbnail: string;
  _id: string;
}

export async function mapLoader({ params }: LoaderFunctionArgs) {
  const { mapId } = params;
  const mindmap = await fetch(`/mindmap/${mapId}`);

  if (!mindmap) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  return mindmap.json();
}

export const Mindmap = () => {
  const data = useLoaderData() as MindmapProps;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const params = useParams();
  const { appCode, currentApp, currentLanguage } = useOdeClient();
  const { t } = useTranslation();
  const { data: actions } = useActions();

  const canExport = actions?.some((action) => action.available);

  const onCancel = () => {
    setOpenModal(false);
  };

  return data?.map ? (
    <>
      {/* <Breadcrumb
        app={currentApp!}
        name={data.name}
        actions={
          <>
            {canExport ? (
              <Button
                variant="outline"
                className="ms-4"
                onClick={() => setOpenModal(true)}
              >
                {t("mindmap.export", { ns: appCode })}
              </Button>
            ) : null}
            <Button
              color="primary"
              variant="filled"
              className="ms-4"
              onClick={() => {
                console.log("save");
              }}
            >
              {t("mindmap.save", { ns: appCode })}
            </Button>
          </>
        }
      /> */}
      <div className="mindplot-div-container">
        <Editor
          mapInfo={mapInfo(data?.name)}
          options={{
            mode: "edition-editor",
            locale: currentLanguage ?? "en",
            enableKeyboardEvents: true,
            enableAppBar: false,
          }}
          persistenceManager={persistenceManager(
            `/mindmap/${params?.mapId}`,
            data?.name,
          )}
        >
          <Breadcrumb
            app={currentApp!}
            name={data.name}
            actions={
              <>
                {canExport ? (
                  <Button
                    variant="outline"
                    className="ms-4"
                    onClick={() => setOpenModal(true)}
                  >
                    {t("mindmap.export", { ns: appCode })}
                  </Button>
                ) : null}
                <Button
                  color="primary"
                  variant="filled"
                  className="ms-4"
                  onClick={() => {
                    console.log("save");
                  }}
                >
                  {t("mindmap.save", { ns: appCode })}
                </Button>
              </>
            }
          />
        </Editor>
      </div>
      {openModal && (
        <ExportModal
          isOpen={openModal}
          mapName={data?.name}
          onCancel={onCancel}
        />
      )}
    </>
  ) : (
    <p>No mindmap found</p>
  );
};
