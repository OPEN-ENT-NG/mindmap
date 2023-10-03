import { useUser } from "@edifice-ui/react";

import { rights } from "~/config";
import { MindmapProps } from "~/routes/mindmap";
import { useActions } from "~/services/queries";

export const useUserRights = ({
  data,
}: {
  data: MindmapProps;
}): {
  canUpdate: boolean | undefined;
  canExport: boolean | undefined;
} => {
  const { user } = useUser();
  const { data: actions } = useActions();
  const { shared } = data;

  const userId = user?.userId;
  const groupsIds = user?.groupsIds;
  const isOwner = data?.owner.userId === user?.userId;

  let canUpdate = true;

  if (isOwner) {
    canUpdate = true;
  }

  if (rights) {
    for (const right of shared) {
      if (right["groupId"] !== undefined) {
        if (groupsIds?.includes(right["groupId"])) {
          canUpdate = right[rights.contrib.right];
        }
      }
      if (right["userId"] !== undefined) {
        if (userId === right["userId"]) {
          canUpdate = right[rights.contrib.right];
        }
      }
    }
  }

  const canExport = actions?.some((action) => action.available);

  return {
    canUpdate,
    canExport,
  };
};
