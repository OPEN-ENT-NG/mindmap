import { HttpResponse, http } from 'msw';

import { mockMindmap } from '~/mocks';
import { server } from '~/mocks/server';
import MindmapStorageManager from './MindmapStorageManager';

const documentUrl = `/mindmap/${mockMindmap._id}`;

const getCentralTopicText = (doc: Document) =>
  doc.querySelector('topic[central="true"]')?.getAttribute('text');

describe('MindmapStorageManager', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadMapDom', () => {
    it('parses the map returned by the API', async () => {
      const manager = new MindmapStorageManager(documentUrl, mockMindmap.name);

      const doc = await manager.loadMapDom();

      expect(doc.querySelector('parsererror')).toBeNull();
      expect(getCentralTopicText(doc)).toBe('Mocked mindmap');
    });

    it('falls back to the default map when the API returns no map', async () => {
      server.use(
        http.get(documentUrl, () =>
          HttpResponse.json({ ...mockMindmap, map: '', name: 'Empty map' }),
        ),
      );
      const manager = new MindmapStorageManager(documentUrl, 'Empty map');

      const doc = await manager.loadMapDom();

      expect(doc.querySelector('parsererror')).toBeNull();
      expect(getCentralTopicText(doc)).toBe('Empty map');
    });

    it.each([403, 404])('rejects when the API responds %i', async (status) => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      server.use(
        http.get(documentUrl, () => new HttpResponse(null, { status })),
      );
      const manager = new MindmapStorageManager(documentUrl, mockMindmap.name);

      await expect(manager.loadMapDom()).rejects.toThrow(`Response: ${status}`);
    });
  });

  describe('saveMapXml', () => {
    it('sends the map name and serialized XML to the document URL', async () => {
      let resolveBody: (body: unknown) => void;
      const sentBody = new Promise((resolve) => (resolveBody = resolve));
      server.use(
        http.put(documentUrl, async ({ request }) => {
          resolveBody(await request.json());
          return HttpResponse.json({});
        }),
      );
      const manager = new MindmapStorageManager(documentUrl, 'My mindmap');
      const mapDoc = new DOMParser().parseFromString(
        '<map version="tango"><topic central="true" text="Edited"/></map>',
        'text/xml',
      );

      manager.saveMapXml(mockMindmap._id, mapDoc);

      expect(await sentBody).toEqual({
        name: 'My mindmap',
        map: new XMLSerializer().serializeToString(mapDoc),
      });
    });
  });
});
