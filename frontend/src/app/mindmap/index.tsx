import { Suspense, lazy, useState } from "react";

// @ts-ignore
import Editor, { useEditor, Designer } from "@edifice-wisemapping/editor";
import { Breadcrumb, Button, LoadingScreen } from "@ode-react-ui/components";
import { useOdeClient } from "@ode-react-ui/core";
import { ID } from "ode-ts-client";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";

import { mapInfo, persistenceManager } from "~/features/mindmap/configuration";
import { useActions } from "~/services/queries";
import { DEFAULT_MAP } from "~/shared/default-map";
import "~/styles/index.css";

const ExportModal = lazy(async () => await import("~/features/export-modal"));

export interface MindmapProps {
  _id: string;
  created: Date;
  description: string;
  map: string;
  modified: Date;
  name: string;
  owner: { userId: ID; displayName: string };
  shared: any[];
  thumbnail: string;
}

export async function mapLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const response = await fetch(`/mindmap/${id}`);
  const mindmap = await response.json();

  if (!response) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  return mindmap.map
    ? mindmap
    : {
        ...mindmap,
        map: DEFAULT_MAP(mindmap?.name),
      };
}

export const Mindmap = () => {
  const data = useLoaderData() as MindmapProps;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const params = useParams();
  const { appCode, currentApp, currentLanguage } = useOdeClient();
  const { t } = useTranslation();
  const { data: actions } = useActions();

  const editor = useEditor({
    mapInfo: mapInfo(data?.name, data?.name),
    options: {
      mode: "edition-editor",
      locale: currentLanguage ?? "en",
      enableKeyboardEvents: true,
      enableAppBar: false,
    },
    persistenceManager: persistenceManager(
      `/mindmap/${params?.id}`,
      data?.name,
    ),
  });

  const handleOnEditorSave = () => {
    editor.model.save(true);
  };

  const canExport = actions?.some((action) => action.available);

  return data?.map ? (
    <>
      <Breadcrumb
        app={currentApp!}
        name={data.name}
        isFullscreen
        render={() => (
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
              onClick={handleOnEditorSave}
            >
              {t("mindmap.save", { ns: appCode })}
            </Button>
          </>
        )}
      />
      <div className="mindplot-div-container">
        <Editor
          editor={editor}
          onLoad={(designer: Designer) => {
            designer.addEvent("loadSuccess", () => {
              const elem = document.getElementById("mindmap-comp");
              if (elem) {
                elem.classList.add("ready");
              }
            });
          }}
        />
      </div>
      <Suspense fallback={<LoadingScreen />}>
        {openModal && (
          <ExportModal
            isOpen={openModal}
            setOpenModal={setOpenModal}
            mapName={data?.name}
          />
        )}
      </Suspense>
    </>
  ) : (
    <p>No mindmap found</p>
  );
};
