import { odeServices } from "ode-ts-client";

import { MindmapProps } from "~/app/mindmap";

export type UpdateMindmapProps = Pick<MindmapProps, "name" | "map">;

export const updateMindmap = (url: string, body: UpdateMindmapProps): void => {
  odeServices.http().put(url, body);
};
