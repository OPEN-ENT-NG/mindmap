// @ts-ignore
import Editor from "@edifice-wisemapping/editor";
import { useOdeClient } from "@ode-react-ui/core";
import { ID } from "ode-ts-client";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";

// eslint-disable-next-line import/order
import {
  mapInfo,
  options,
  persistenceManager,
} from "~/features/mindmap/configuration";

import "~/styles/index.css";

// eslint-disable-next-line import/order
import { AppHeader } from "@ode-react-ui/components";
// eslint-disable-next-line import/order
import { AppAction } from "../components/AppAction";

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

  return mindmap.json();
}

export const Mindmap = () => {
  const data = useLoaderData() as MindmapProps;
  const { currentApp } = useOdeClient();
  const { currentLanguage } = useOdeClient();
  const params = useParams();

  return data?.map ? (
    <>
      <AppHeader
        app={currentApp}
        resourceName={data?.name}
        actions={<AppAction />}
      />
      <div className="mindplot-div-container">
        <Editor
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
