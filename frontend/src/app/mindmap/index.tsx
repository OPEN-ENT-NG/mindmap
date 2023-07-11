// @ts-ignore
import Editor, { Designer } from "@edifice-wisemapping/editor";
import { useOdeClient } from "@ode-react-ui/core";
import { ID } from "ode-ts-client";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";

import {
  mapInfo,
  options,
  persistenceManager,
} from "~/features/mindmap/configuration";

import "~/styles/index.css";

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

/* const initialization = (designer: Designer) => {
  designer.addEvent("loadSuccess", () => {
    const elem = document.getElementById("mindmap-comp");
    if (elem) {
      elem.classList.add("ready");
    }
  });
}; */

export const Mindmap = () => {
  const data = useLoaderData() as MindmapProps;
  const { currentLanguage } = useOdeClient();
  const params = useParams();

  return data?.map ? (
    <>
      <div className="mindplot-div-container">
        <Editor
          // onLoad={initialization}
          mapInfo={mapInfo(data?.name)}
          onAction={(action: any) => {
            console.log("action called:", action);
          }}
          options={options("edition-editor", currentLanguage ?? "en", true)}
          persistenceManager={persistenceManager(
            `/mindmap/${params?.mapId}`,
            data?.name,
          )}
        />
      </div>
    </>
  ) : (
    <p>No mindmap found</p>
  );
};
