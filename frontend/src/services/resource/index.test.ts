import { odeServices } from '@edifice.io/client';
import { HttpResponse, http } from 'msw';

import { mockMindmap } from '~/mocks';
import { server } from '~/mocks/server';
import { MindmapResourceService } from '.';

const parseMap = (xml: string) =>
  new DOMParser().parseFromString(xml, 'text/xml');

/** Calls create() and returns the body sent to POST /mindmap */
const createAndCaptureBody = async (name: string) => {
  let body: Record<string, unknown> = {};
  server.use(
    http.post('/mindmap', async ({ request }) => {
      body = (await request.json()) as Record<string, unknown>;
      return HttpResponse.json({ _id: mockMindmap._id });
    }),
  );

  const service = new MindmapResourceService(odeServices);
  const result = await service.create({
    name,
    description: '',
    folder: undefined,
  } as any);

  return { body, result };
};

describe('MindmapResourceService.create', () => {
  it('posts a valid default map with the name as central topic', async () => {
    const { body, result } = await createAndCaptureBody('My mindmap');
    const doc = parseMap(body.map as string);

    expect(result.entId).toBe(mockMindmap._id);
    expect(doc.querySelector('parsererror')).toBeNull();
    expect(
      doc.querySelector('topic[central="true"]')?.getAttribute('text'),
    ).toBe('My mindmap');
  });
});
