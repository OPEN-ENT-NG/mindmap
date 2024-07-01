import { odeServices } from "edifice-ts-client";

import { MindmapProps } from "~/routes/mindmap";

export type UpdateMindmapProps = Pick<MindmapProps, "name" | "map">;

export const getMindmap = async (url: string): Promise<MindmapProps> => {
  return await odeServices.http().get(url);
};

/**
 * sessionHasWorkflowRights API
 * @param url
 * @param mindmap body with name and current map
 */
export const updateMindmap = async (
  url: string,
  mindmapBody: UpdateMindmapProps,
) => {
  return await odeServices.http().putJson(url, mindmapBody);
};

/**
 * sessionHasWorkflowRights API
 * @param actionRights
 * @returns check if user has rights
 */
export const sessionHasWorkflowRights = async (actionRights: string[]) => {
  return await odeServices.rights().sessionHasWorkflowRights(actionRights);
};

/**
 * hasResourceRight API
 * @param actionRights
 * @returns check if user has rights
 */
/* export const hasResourceRight = async () => {
  return await odeServices.rights().hasResourceRight();
}; */
