import {
  MAX_IMPORT_FILE_SIZE_MB,
  convertMindmapFile,
} from './convert-mindmap-file';

const FREEMIND_MAP = `<map version="1.0.1">
<node TEXT="Révolution française" ID="ID_1">
  <node TEXT="Causes" POSITION="right" ID="ID_2" LINK="https://fr.wikipedia.org/wiki/Lumières">
    <node TEXT="Crise financière" ID="ID_3"/>
  </node>
  <node TEXT="Événements" POSITION="left" ID="ID_4" LINK="javascript:alert(1)"/>
</node>
</map>`;

const WISEMAPPING_MAP = `<map name="Carte" version="tango">
<topic central="true" text="Racine" id="1">
  <topic position="200,0" order="0" text="Site" id="2"><link url="https://edifice.io" urlType="url"/></topic>
  <topic position="-200,0" order="0" text="Piège" id="3"><link url="javascript:alert(1)" urlType="url"/></topic>
</topic>
</map>`;

const FREEMIND_MAP_WITH_RICH_NOTE = `<map version="1.0.1">
<node TEXT="Racine" ID="ID_1">
  <node TEXT="Enfant" POSITION="right" ID="ID_2">
    <richcontent TYPE="NOTE"><html><head><style>p { margin: 0 }</style></head><body><p>Texte de la note</p><img src="x" onerror="alert(1)"/></body></html></richcontent>
  </node>
</node>
</map>`;

const WISEMAPPING_MAP_WITH_HTML_NOTE = `<map name="Carte" version="tango">
<topic central="true" text="Racine" id="1">
  <note><![CDATA[<b>Note</b> importée<img src="x" onerror="alert(1)">]]></note>
</topic>
</map>`;

const encodeUtf16LeWithBom = (text: string) => {
  const bytes = new Uint8Array(2 + text.length * 2);
  bytes.set([0xff, 0xfe]);
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    bytes[2 + index * 2] = code & 0xff;
    bytes[3 + index * 2] = code >> 8;
  }
  return bytes;
};

const encodeLatin1 = (text: string) =>
  Uint8Array.from(text, (char) => char.charCodeAt(0));

const parseXml = (xml: string) =>
  new DOMParser().parseFromString(xml, 'text/xml');

const getNoteText = (mapDocument: Document) =>
  mapDocument.querySelector('note')?.textContent;

// The editor displays notes as HTML.
const renderNoteAsTheEditor = (mapXml: string) =>
  new DOMParser().parseFromString(
    getNoteText(parseXml(mapXml)) ?? '',
    'text/html',
  ).body;

const wiseMappingMapWithNote = (note: string) =>
  new File(
    [
      `<map name="Carte" version="tango"><topic central="true" text="Racine" id="1">${note}</topic></map>`,
    ],
    'carte.wxml',
  );

const getCentralTopicText = (mapXml: string) =>
  parseXml(mapXml)
    .querySelector('map > topic[central="true"]')
    ?.getAttribute('text');

const getLinkUrls = (mapDocument: Document) =>
  Array.from(mapDocument.querySelectorAll('link')).map((link) =>
    link.getAttribute('url'),
  );

describe('convertMindmapFile', () => {
  it('converts a FreeMind file into a WiseMapping map', async () => {
    const file = new File([FREEMIND_MAP], 'revolution.MM');

    const mapDocument = parseXml(await convertMindmapFile(file));

    expect(
      mapDocument
        .querySelector('map > topic[central="true"]')
        ?.getAttribute('text'),
    ).toBe('Révolution française');
    expect(mapDocument.querySelectorAll('topic')).toHaveLength(4);
    expect(mapDocument.documentElement.getAttribute('theme')).toBe('prism');
  });

  it('keeps web links and drops unsafe ones from a FreeMind file', async () => {
    const file = new File([FREEMIND_MAP], 'revolution.mm');

    const mapDocument = parseXml(await convertMindmapFile(file));

    expect(getLinkUrls(mapDocument)).toEqual([
      'https://fr.wikipedia.org/wiki/Lumières',
    ]);
  });

  it('imports a WiseMapping file and drops unsafe links', async () => {
    const file = new File([WISEMAPPING_MAP], 'carte.wxml');

    const mapDocument = parseXml(await convertMindmapFile(file));

    expect(mapDocument.querySelectorAll('topic')).toHaveLength(3);
    expect(getLinkUrls(mapDocument)).toEqual(['https://edifice.io']);
  });

  it('passes only the text of FreeMind rich notes to the importer', async () => {
    const innerHtmlSetter = vi.spyOn(Element.prototype, 'innerHTML', 'set');
    const file = new File([FREEMIND_MAP_WITH_RICH_NOTE], 'carte.mm');

    const mapXml = await convertMindmapFile(file);

    const htmlGivenToInnerHtml = innerHtmlSetter.mock.calls.flat().join('');
    innerHtmlSetter.mockRestore();
    expect(htmlGivenToInnerHtml).not.toContain('<img');
    expect(getNoteText(parseXml(mapXml))).toBe('Texte de la note');
    expect(mapXml).not.toContain('onerror');
  });

  it('keeps only the text of WiseMapping notes', async () => {
    const file = new File([WISEMAPPING_MAP_WITH_HTML_NOTE], 'carte.wxml');

    const mapXml = await convertMindmapFile(file);

    expect(getNoteText(parseXml(mapXml))).toBe('Note importée');
    expect(mapXml).not.toContain('onerror');
  });

  it.each([
    ['CDATA', '<note><![CDATA[&lt;img src=x onerror=alert(1)&gt;]]></note>'],
    [
      'text attribute',
      '<note text="%26lt%3Bimg%20src%3Dx%20onerror%3Dalert(1)%26gt%3B"/>',
    ],
  ])('keeps entity-encoded markup of a %s note as text', async (_, note) => {
    const mapXml = await convertMindmapFile(wiseMappingMapWithNote(note));

    const renderedNote = renderNoteAsTheEditor(mapXml);
    expect(renderedNote.children).toHaveLength(0);
    expect(renderedNote.textContent).toBe('<img src=x onerror=alert(1)>');
  });

  it('keeps the ampersands of a note as typed, the note editor shows it raw', async () => {
    const mapXml = await convertMindmapFile(
      wiseMappingMapWithNote(
        '<note><![CDATA[<p>R&amp;D et Q&amp;R</p>]]></note>',
      ),
    );

    expect(getNoteText(parseXml(mapXml))).toBe('R&D et Q&R');
  });

  it('decodes a UTF-16 file starting with a BOM', async () => {
    const file = new File(
      [encodeUtf16LeWithBom(FREEMIND_MAP)],
      'revolution.mm',
    );

    expect(getCentralTopicText(await convertMindmapFile(file))).toBe(
      'Révolution française',
    );
  });

  it('decodes a file in the encoding declared by its XML prolog', async () => {
    const file = new File(
      [
        encodeLatin1(
          `<?xml version="1.0" encoding="ISO-8859-1"?>\n${FREEMIND_MAP}`,
        ),
      ],
      'revolution.mm',
    );

    expect(getCentralTopicText(await convertMindmapFile(file))).toBe(
      'Révolution française',
    );
  });

  it('decodes as UTF-8 a file declaring an unknown encoding', async () => {
    const file = new File(
      [`<?xml version="1.0" encoding="x-inconnu"?>\n${FREEMIND_MAP}`],
      'revolution.mm',
    );

    expect(getCentralTopicText(await convertMindmapFile(file))).toBe(
      'Révolution française',
    );
  });

  it('rejects an unsupported format', async () => {
    const file = new File(['%PDF-1.7'], 'carte.pdf');

    await expect(convertMindmapFile(file)).rejects.toMatchObject({
      code: 'UNSUPPORTED_FORMAT',
    });
  });

  it('rejects a file over the size limit', async () => {
    const tooLargeContent = 'a'.repeat(
      MAX_IMPORT_FILE_SIZE_MB * 1024 * 1024 + 1,
    );
    const file = new File([tooLargeContent], 'carte.mm');

    await expect(convertMindmapFile(file)).rejects.toMatchObject({
      code: 'FILE_TOO_LARGE',
    });
  });

  it.each([
    ['carte.mm', 'not a mind map'],
    ['carte.wxml', 'not a mind map'],
    ['carte.wxml', '<map version="tango"><topic text="No central"/></map>'],
  ])('rejects invalid content in %s', async (fileName, content) => {
    const file = new File([content], fileName);

    await expect(convertMindmapFile(file)).rejects.toMatchObject({
      code: 'INVALID_CONTENT',
    });
  });
});
