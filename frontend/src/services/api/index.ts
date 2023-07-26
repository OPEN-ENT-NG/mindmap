import { odeServices } from "ode-ts-client";

import { MindmapProps } from "~/app/mindmap";

export type UpdateMindmapProps = Pick<MindmapProps, "name" | "map">;

export const updateMindmap = (url: string, body: UpdateMindmapProps): void => {
  odeServices.http().put(url, body);
};

/**
 * sessionHasWorkflowRights API
 * @param actionRights
 * @returns check if user has rights
 */
export const sessionHasWorkflowRights = async (actionRights: string[]) => {
  return await odeServices.rights().sessionHasWorkflowRights(actionRights);
};
