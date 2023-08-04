import { odeServices } from "ode-ts-client";

import { MindmapProps } from "~/routes/mindmap";

export type UpdateMindmapProps = Pick<MindmapProps, "name" | "map">;

export const getMindmap = async (url: string): Promise<void> => {
  return await odeServices.http().get(url);
};

/* export const updateMindmap = (
  url: string,
  body: UpdateMindmapProps,
): Promise<void> => {
  console.log(url, body);
  return odeServices.http().put(url, body);
}; */

export const updateMindmap = async (
  url: string,
  mindmapBody: UpdateMindmapProps,
) => {
  console.log({ mindmapBody });
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
