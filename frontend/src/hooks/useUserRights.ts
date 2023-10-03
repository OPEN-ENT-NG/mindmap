import { useUser } from "@edifice-ui/react";

import { rights } from "~/config";
import { MindmapProps } from "~/routes/mindmap";
import { useActions } from "~/services/queries";

export const useUserRights = ({ data }: { data: MindmapProps }) => {
  const { user } = useUser();
  const { data: actions } = useActions();

  const filteredUserRights = data.shared.filter(
    (share) => share.userId === user?.userId,
  );

  const [userRights] = filteredUserRights;

  const canUpdate = userRights[rights.contrib.right];
  const canExport = actions?.some((action) => action.available);

  return {
    canUpdate,
    canExport,
  };
};
