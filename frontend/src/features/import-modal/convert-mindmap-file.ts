import {
  TextImporterFactory,
  // @ts-ignore
} from '@edifice-wisemapping/editor';

import { MindmapImportError } from './mindmap-import-error';

const IMPORT_FORMATS = ['mm', 'wxml'] as const;
type ImportFormat = (typeof IMPORT_FORMATS)[number];

export const ACCEPTED_IMPORT_EXTENSIONS = IMPORT_FORMATS.map(
  (format) => `.${format}`,
);
export const MAX_IMPORT_FILE_SIZE_MB = 5;
const MAX_IMPORT_FILE_SIZE = MAX_IMPORT_FILE_SIZE_MB * 1024 * 1024;

// The importer omits the theme: use the one of maps created in the app (see DEFAULT_MAP).
const DEFAULT_THEME = 'prism';
const ALLOWED_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:'];

const getImportFormat = (fileName: string): ImportFormat | undefined => {
  const extension = fileName.toLowerCase().split('.').pop();
  return IMPORT_FORMATS.find((format) => format === extension);
};

const isAllowedLink = (url: string | null): boolean => {
  if (!url) return false;
  try {
    return ALLOWED_LINK_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return false;
  }
};

const readFileBytes = (file: File): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    // readAsArrayBuffer always yields an ArrayBuffer.
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });

const getBomEncoding = (bytes: Uint8Array): string | undefined => {
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return 'utf-8';
  }
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return 'utf-16le';
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return 'utf-16be';
  return undefined;
};

// Without a BOM, the XML declaration is in ASCII whatever the declared encoding.
const getDeclaredEncoding = (bytes: Uint8Array): string | undefined => {
  const prolog = new TextDecoder('ascii').decode(bytes.subarray(0, 200));
  return /^<\?xml[^>]*\sencoding\s*=\s*["']([A-Za-z0-9._-]+)["']/.exec(
    prolog,
  )?.[1];
};

// An XML file may be UTF-16 (BOM) or declare another encoding, such as ISO-8859-1.
const readFileAsText = async (file: File): Promise<string> => {
  const bytes = await readFileBytes(file);
  const encoding =
    getBomEncoding(bytes) ?? getDeclaredEncoding(bytes) ?? 'utf-8';
  try {
    return new TextDecoder(encoding).decode(bytes);
  } catch {
    // Unknown encoding label.
    return new TextDecoder().decode(bytes);
  }
};

const toPlainText = (html: string): string =>
  new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ??
  '';

// The FreeMind importer turns rich notes into text through the innerHTML of a
// live element, which runs their event handlers: only their text may reach it.
const removeRichContentMarkup = (freemindXml: string): string => {
  const freemindDocument = new DOMParser().parseFromString(
    freemindXml,
    'text/xml',
  );
  if (freemindDocument.querySelector('parsererror')) {
    throw new MindmapImportError('INVALID_CONTENT');
  }

  freemindDocument.querySelectorAll('richcontent').forEach((richContent) => {
    const textSource = richContent.querySelector('body') ?? richContent;
    const html = freemindDocument.createElement('html');
    html.textContent = textSource.textContent?.trim() ?? '';
    richContent.replaceChildren(html);
  });

  return new XMLSerializer().serializeToString(freemindDocument);
};

// The tooltip renders notes as HTML while the note editor shows them raw. The
// extracted text decodes entities such as "&lt;img": escape "<", the only
// character that opens a tag. Escaping "&" too would show "&amp;" in the editor.
const toSafeNoteText = (html: string): string =>
  toPlainText(html).replace(/</g, '&lt;');

const sanitizeNote = (mapDocument: Document, note: Element) => {
  const text = note.getAttribute('text');
  if (text !== null) {
    note.setAttribute('text', toSafeNoteText(text));
    return;
  }
  // A CDATA section cannot contain its own end delimiter.
  const safeText = toSafeNoteText(note.textContent ?? '').replace(
    /]]>/g,
    ']] >',
  );
  note.replaceChildren(mapDocument.createCDATASection(safeText));
};

const convertToMapXml = async (
  format: ImportFormat,
  content: string,
  mapName: string,
): Promise<string> => {
  const importerInput =
    format === 'mm' ? removeRichContentMarkup(content) : content;
  try {
    return await TextImporterFactory.create(format, importerInput).import(
      mapName,
      '',
    );
  } catch (error) {
    console.error('[mindmap] Failed to convert the imported file', error);
    throw new MindmapImportError('INVALID_CONTENT');
  }
};

const sanitizeMapXml = (mapXml: string): string => {
  const mapDocument = new DOMParser().parseFromString(mapXml, 'text/xml');
  const map = mapDocument.documentElement;
  const isValidMap =
    map.nodeName === 'map' &&
    !mapDocument.querySelector('parsererror') &&
    mapDocument.querySelector('map > topic[central="true"]') !== null;

  if (!isValidMap) throw new MindmapImportError('INVALID_CONTENT');

  if (!map.hasAttribute('theme')) map.setAttribute('theme', DEFAULT_THEME);
  mapDocument.querySelectorAll('link').forEach((link) => {
    if (!isAllowedLink(link.getAttribute('url'))) link.remove();
  });
  mapDocument
    .querySelectorAll('note')
    .forEach((note) => sanitizeNote(mapDocument, note));

  return new XMLSerializer().serializeToString(mapDocument);
};

export const getMapName = (file: File): string =>
  file.name.replace(/\.[^.]+$/, '');

export const convertMindmapFile = async (file: File): Promise<string> => {
  const format = getImportFormat(file.name);
  if (!format) throw new MindmapImportError('UNSUPPORTED_FORMAT');
  if (file.size > MAX_IMPORT_FILE_SIZE) {
    throw new MindmapImportError('FILE_TOO_LARGE');
  }

  const content = await readFileAsText(file);
  const mapXml = await convertToMapXml(format, content, getMapName(file));
  return sanitizeMapXml(mapXml);
};
