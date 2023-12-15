import { Suspense, useEffect, useState } from "react";

import {
  useOdeClient,
  Breadcrumb,
  Button,
  AppHeader,
  LoadingScreen,
  useUser,
} from "@edifice-ui/react";
// @ts-ignore
import Editor, { useEditor, Designer } from "@edifice-wisemapping/editor";
import { ID, IWebApp, MindmapResource } from "edifice-ts-client";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";

import { DEFAULT_MAP } from "~/config/default-map";
import ExportModal from "~/features/export-modal";
import { mapInfo, persistenceManager } from "~/features/mindmap/configuration";
import { useUserRights } from "~/hooks/useUserRights";

// const ExportModal = lazy(async () => await import("~/features/export-modal"));

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
  const [trashed, setTrashed] = useState<boolean>(false);
  const data = useLoaderData() as MindmapProps;
  const params = useParams();
  const { user } = useUser();

  const { appCode, currentApp, currentLanguage } = useOdeClient();
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState<boolean>(false);

  const { canUpdate, canExport } = useUserRights({ data });

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

  /**
   * Fix #WB2-1252: show 404 resource error page if resource is in trash.
   * Check if resource is trashed.
   */
  useEffect(() => {
    (async () => {
      // To know if the resource has been trashed we need to request Explorer API. The information is not updates in legacy app.
      const explorerMindmapResponse = await fetch(
        `/explorer/resources?application=mindmap&resource_type=mindmap&asset_id[]=${params?.id}`,
      );
      const explorerMindmapData = await explorerMindmapResponse.json();
      const explorerMindmap = explorerMindmapData?.resources?.find(
        (resource: MindmapResource) => resource.assetId === params?.id,
      );
      if (
        explorerMindmap?.trashed ||
        explorerMindmap?.trashedBy?.includes(user?.userId)
      ) {
        // Error boundaries are not working with async calls,
        // so we need to use a state and then in another useEffect we handle the error
        setTrashed(true);
      }
    })();
  }, []);

  /**
   * Fix #WB2-1252: show 404 resource error page if resource is in trash.
   * The useEffect to handle the error of a trashed resource.
   */
  useEffect(() => {
    if (trashed) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
  }, [trashed]);

  const handleOnEditorSave = () => editor.model.save(true);

  return data?.map ? (
    <>
      <AppHeader
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
