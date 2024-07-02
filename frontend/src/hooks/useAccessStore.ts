import { useUserRightsStore } from "~/store";

export const useAccessStore = () => {
  const userRights = useUserRightsStore((state) => state.userRights);

  const canUpdate =
    userRights.creator || userRights.contrib || userRights.manager;

  const canExport = true;

  return { userRights, canUpdate, canExport };
};
