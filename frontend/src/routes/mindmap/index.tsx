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
import { IWebApp, odeServices } from "edifice-ts-client";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";

import { DEFAULT_MAP } from "~/config/default-map";
import ExportModal from "~/features/export-modal";
import { mapInfo, persistenceManager } from "~/features/mindmap/configuration";
import { useAccessStore } from "~/hooks/useAccessStore";
import { MindmapProps } from "~/models/mindmap";
import { getMindmap } from "~/services/api";
import { useUserRightsStore } from "~/store";
import { checkUserRight } from "~/utils/checkUserRight";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const data = await getMindmap(`/mindmap/${id}`);

  if (odeServices.http().isResponseError()) {
    throw new Response("", {
      status: odeServices.http().latestResponse.status,
      statusText: odeServices.http().latestResponse.statusText,
    });
  }

  const userRights = await checkUserRight(data.rights);
  const { setUserRights } = useUserRightsStore.getState();
  setUserRights(userRights);

  return data.map
    ? data
    : {
        ...data,
        map: DEFAULT_MAP(data?.name),
      };
}

export const Mindmap = () => {
  const data = useLoaderData() as MindmapProps;
  const params = useParams();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const { appCode, currentApp, currentLanguage } = useOdeClient();
  const { canUpdate, canExport } = useAccessStore();
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
