import { useEffect, useState } from "react";

import { useOdeClient, useUser } from "@edifice-ui/react";
import { IResource } from "edifice-ts-client";
import { Params } from "react-router-dom";

export const useTrashedResource = (params: Params) => {
  const { appCode } = useOdeClient();
  const { user } = useUser();

  const [trashed, setTrashed] = useState<boolean>(false);
  /**
   * Fix #WB2-1252: show 404 resource error page if resource is in trash.
   * Check if resource is trashed.
   */
  useEffect(() => {
    (async () => {
      // To know if the resource has been trashed we need to request Explorer API. The information is not updates in legacy app.
      const explorerResponse = await fetch(
        `/explorer/resources?application=${appCode}&resource_type=${appCode}&asset_id[]=${params?.id}`,
      );
      const explorerData = await explorerResponse.json();
      const resource = explorerData?.resources?.find(
        (resource: IResource) => resource.assetId === params?.id,
      );
      if (resource?.trashed || resource?.trashedBy?.includes(user?.userId)) {
        // Error boundaries are not working with async calls,
        // so we need to use a state and then in another useEffect we handle the error
        setTrashed(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
};
