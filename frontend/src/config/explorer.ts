import { AppParams } from 'ode-explorer/lib';

import { MindmapResourceService } from '~/services/resource';
import { workflows } from './workflows';

export const explorerConfig: AppParams = {
  app: 'mindmap',
  types: ['mindmap'],
  libraryAppFilter: 'MindMap',
  service: MindmapResourceService,
  filters: [
    { id: 'owner', defaultValue: true },
    { id: 'public', defaultValue: false },
    { id: 'shared', defaultValue: true },
  ],
  orders: [
    { id: 'name', defaultValue: 'asc', i18n: 'explorer.sorts.name' },
    { id: 'updatedAt', i18n: 'explorer.sorts.updatedat' },
  ],
  actions: [
    {
      id: 'open',
      workflow: workflows.view,
      target: 'actionbar',
      right: 'read',
    },
    {
      id: 'share',
      workflow: workflows.view,
      target: 'actionbar',
      right: 'manager',
    },
    {
      id: 'edit',
      workflow: workflows.view,
      target: 'actionbar',
      right: 'manager',
    },
    {
      id: 'create',
      workflow: workflows.create,
      target: 'tree',
    },
    {
      id: 'copy',
      workflow: workflows.view,
      target: 'actionbar',
      right: 'read',
    },
    {
      id: 'move',
      workflow: workflows.view,
      target: 'actionbar',
      right: 'read',
    },
    {
      id: 'publish',
      workflow: workflows.publish,
      target: 'actionbar',
      right: 'creator',
    },
    {
      id: 'print',
      workflow: workflows.print,
      target: 'actionbar',
      right: 'read',
    },
    {
      id: 'delete',
      workflow: workflows.view,
      target: 'actionbar',
      right: 'read',
    },
  ],
  trashActions: [
    {
      id: 'restore',
      available: true,
      target: 'actionbar',
      workflow: '',
      right: 'manager',
    },
    {
      id: 'delete',
      available: true,
      target: 'actionbar',
      workflow: '',
      right: 'manager',
    },
  ],
};
