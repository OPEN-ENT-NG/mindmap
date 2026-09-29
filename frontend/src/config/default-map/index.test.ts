import { DEFAULT_MAP } from '.';

const parseMap = (xml: string) =>
  new DOMParser().parseFromString(xml, 'text/xml');

describe('DEFAULT_MAP', () => {
  it('produces a valid map with the name as central topic', () => {
    const doc = parseMap(DEFAULT_MAP('My mindmap'));

    expect(doc.querySelector('parsererror')).toBeNull();
    expect(
      doc.querySelector('topic[central="true"]')?.getAttribute('text'),
    ).toBe('My mindmap');
  });
});
