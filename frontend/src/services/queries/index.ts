import { IAction } from '@edifice.io/client';
import { useQuery } from '@tanstack/react-query';

import { workflows } from '~/config';
import { sessionHasWorkflowRights } from '../api';

/**
 * useActions query
 * set actions correctly with workflow rights
 * @returns actions data
 */
// const { actions } = getAppParams();
export const useActions = () => {
  const { exportpng, exportsvg } = workflows;

  return useQuery<Record<string, boolean>, Error, IAction[]>({
    queryKey: ['actions'],
    queryFn: async () => {
      const availableRights = await sessionHasWorkflowRights([
        exportpng,
        exportsvg,
      ]);
      return availableRights;
    },
    select: (data) => {
      const actions: any[] = [
        {
          id: 'export-png',
          workflow: exportpng,
        },
        {
          id: 'export-svg',
          workflow: exportsvg,
        },
      ];
      return actions.map((action) => ({
        ...action,
        available: data[action.workflow],
      }));
    },
  });
};
