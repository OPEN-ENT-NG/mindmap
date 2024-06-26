import { Suspense, useState } from "react";

import { Redo, Undo } from "@edifice-ui/icons";
import {
  AppHeader,
  Breadcrumb,
  Button,
  LoadingScreen,
  Tooltip,
  useOdeClient,
  useTrashedResource,
} from "@edifice-ui/react";
// @ts-ignore
import Editor, { useEditor } from "@edifice-wisemapping/editor";
import { ID, IWebApp } from "edifice-ts-client";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";

import { DEFAULT_MAP } from "~/config/default-map";
import ExportModal from "~/features/export-modal";
import { mapInfo, persistenceManager } from "~/features/mindmap/configuration";
import { useUserRights } from "~/hooks/useUserRights";
import { getMindmap } from "~/services/api";

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

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const response = await getMindmap(`/mindmap/${id}`);

  if (!response) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  return response.map
    ? response
    : {
        ...response,
        map: DEFAULT_MAP(response?.name),
      };
}

export const Mindmap = () => {
  const data = useLoaderData() as MindmapProps;
  const params = useParams();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const { appCode, currentApp, currentLanguage } = useOdeClient();
  const { canUpdate, canExport } = useUserRights(data);
  const { t } = useTranslation();

  useTrashedResource(params?.id);

  const editor = useEditor({
    mapInfo: mapInfo(data?.name, data?.name),
    options: {
      mode: canUpdate ? "edition-owner" : "viewonly",
      locale: currentLanguage ?? "en",
      enableKeyboardEvents: true,
      enableAppBar: false,
      saveOnLoad: false,
    },
    persistenceManager: persistenceManager(
      `/mindmap/${params?.id}`,
      data?.name,
    ),
  });

  const handleOnEditorSave = () => editor.model.save(true);

  // @ts-ignore
  const designer: Designer = globalThis.designer;

  return (
    data?.map && (
      <>
        <AppHeader
          style={{ position: "fixed" }}
          isFullscreen
          render={() => (
            <>
              {canExport ? (
                <Button variant="outline" onClick={() => setOpenModal(true)}>
                  {t("mindmap.export", { ns: appCode })}
                </Button>
              ) : null}
              {canUpdate ? (
                <Button
                  color="primary"
                  variant="filled"
                  className="ms-4"
                  onClick={handleOnEditorSave}
                >
                  {t("mindmap.save", { ns: appCode })}
                </Button>
              ) : null}
            </>
          )}
        >
          <Breadcrumb app={currentApp as IWebApp} name={data.name} />
        </AppHeader>
        <div className="mindplot-div-container">
          {canUpdate ? (
            <div className="undo-redo-toolbar">
              <Tooltip
                message={t("mindmap.undo", { ns: appCode })}
                placement="bottom-end"
              >
                <button aria-label="undo" onClick={() => designer.undo()}>
                  <Undo width={20} height={20} />
                </button>
              </Tooltip>
              <Tooltip
                message={t("mindmap.redo", { ns: appCode })}
                placement="bottom-end"
              >
                <button onClick={() => designer.redo()} aria-label="redo">
                  <Redo width={20} height={20} />
                </button>
              </Tooltip>
            </div>
          ) : null}
          <Editor editor={editor} />
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
    )
  );
};
