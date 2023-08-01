// @ts-ignore
import { useEffect } from "react";

import Editor, { useEditor, Designer } from "@edifice-wisemapping/editor";
import { useOdeClient } from "@ode-react-ui/core";
import { ID } from "ode-ts-client";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";

import { mapInfo, persistenceManager } from "~/features/mindmap/configuration";
import { DEFAULT_MAP } from "~/shared/default-map";
import "~/styles/index.css";

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
  const data = useLoaderData() as MindmapProps;
  const params = useParams();
  const { currentLanguage } = useOdeClient();

  const editor = useEditor({
    mapInfo: mapInfo(data?.name, data?.name),
    options: {
      mode: "viewonly",
      locale: currentLanguage ?? "en",
      enableKeyboardEvents: false,
      enableAppBar: false,
      zoom: 1.7,
    },
    persistenceManager: persistenceManager(
      `/mindmap/${params?.id}`,
      data?.name,
    ),
  });

  useEffect(() => {
    const designer: Designer = globalThis.designer;
    designer.addEvent("loadSuccess", () => {
      if (designer) {
        window.print();
      }
    });
  }, []);

  return data?.map ? (
    <>
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
    </>
  ) : (
    <p>No mindmap found</p>
  );
};
