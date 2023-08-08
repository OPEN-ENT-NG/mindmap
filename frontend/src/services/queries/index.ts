import { useQuery } from "@tanstack/react-query";
import { IAction } from "edifice-ts-client";

import { sessionHasWorkflowRights } from "../api";

const WORKFLOW_EXPORT_PNG =
  "net.atos.entng.mindmap.controllers.MindmapController|exportPngMindmap";
const WORKFLOW_EXPORT_SVG =
  "net.atos.entng.mindmap.controllers.MindmapController|exportSvgMindmap";

/**
 * useActions query
 * set actions correctly with workflow rights
 * @returns actions data
 */
// const { actions } = getAppParams();
export const useActions = () => {
  return useQuery<Record<string, boolean>, Error, IAction[]>({
    queryKey: ["actions"],
    queryFn: async () => {
      const availableRights = await sessionHasWorkflowRights([
        WORKFLOW_EXPORT_PNG,
        WORKFLOW_EXPORT_SVG,
      ]);
      return availableRights;
    },
    select: (data) => {
      const actions: any[] = [
        {
          id: "export-png",
          workflow: WORKFLOW_EXPORT_PNG,
        },
        {
          id: "export-svg",
          workflow: WORKFLOW_EXPORT_SVG,
        },
      ];
      return actions.map((action) => ({
        ...action,
        available: data[action.workflow],
      }));
    },
  });
};
