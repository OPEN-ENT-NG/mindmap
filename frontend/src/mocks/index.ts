import { MindmapProps } from '~/models/mindmap';

export const mockUserId = 'a1b2c3d4';

export const mockMindmap: MindmapProps = {
  _id: 'mindmap-1',
  created: new Date('2025-01-01T10:00:00Z'),
  modified: new Date('2025-01-02T10:00:00Z'),
  description: 'A mocked mindmap',
  map: '<map version="tango" theme="prism"><topic central="true" text="Mocked mindmap"/></map>',
  name: 'Mocked mindmap',
  owner: { userId: mockUserId, displayName: 'Fake User' },
  shared: [],
  rights: [],
  thumbnail: '',
};
