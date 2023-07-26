import { Suspense, lazy, useState } from "react";

// @ts-ignore
import Editor, { useEditor } from "@edifice-wisemapping/editor";
import { Breadcrumb, Button, LoadingScreen } from "@ode-react-ui/components";
import { useOdeClient } from "@ode-react-ui/core";
import { ID } from "ode-ts-client";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";

import { mapInfo, persistenceManager } from "~/features/mindmap/configuration";
import { useActions } from "~/services/queries";

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
  const mindmap = await fetch(`/mindmap/${id}`);

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

  const [status, setStatus] = useState("");

  const editor = useEditor({
    mapInfo: mapInfo(data?.name),
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

  const canExport = actions?.some((action) => action.available);

  const handleOnEditorSave = () => {
    editor.model.save(true);
  };

  const isLoading = status === "loading";

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
              isLoading={isLoading}
            >
              {t("mindmap.save", { ns: appCode })}
            </Button>
          </>
        )}
      />
      <div className="mindplot-div-container">
        <Editor editor={editor} />
      </div>
      <Suspense fallback={<LoadingScreen />}>
        <ExportModal
          isOpen={openModal}
          setOpenModal={setOpenModal}
          mapName={data?.name}
        />
      </Suspense>
    </>
  ) : (
    <p>No mindmap found</p>
  );
};
