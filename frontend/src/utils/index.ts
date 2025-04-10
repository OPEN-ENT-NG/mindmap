import {
  Designer,
  Exporter,
  ImageExporterFactory,
  Mindmap,
  SizeType,
  TextExporterFactory,
  // @ts-ignore
} from '@edifice-wisemapping/editor';

type ExportFormat = 'svg' | 'jpg' | 'png' | 'mm' | 'wxml';

export const exporter = async (
  formatType: ExportFormat,
  zoomToFit: boolean,
): Promise<string> => {
  let svgElement: Element | null = null;
  let size: SizeType;
  let mindmap: Mindmap;

  // @ts-ignore
  const designer: Designer = globalThis.designer;
  // exporting from editor toolbar action
  if (designer) {
    // Depending on the type of export. It will require differt POST.
    const workspace = designer.getWorkSpace();
    svgElement = workspace.getSVGElement();
    size = { width: window.innerWidth, height: window.innerHeight };
    mindmap = designer.getMindmap();
  }

  let exporter: Exporter;
  switch (formatType) {
    case 'png':
    case 'jpg':
    case 'svg': {
      exporter = ImageExporterFactory.create(
        formatType,
        svgElement,
        size.width,
        size.height,
        zoomToFit,
      );
      break;
    }
    case 'wxml':
    case 'mm': {
      exporter = TextExporterFactory.create(formatType, mindmap);
      break;
    }
    default: {
      const exhaustiveCheck: never = formatType as never;
      throw new Error(`Unhandled color case: ${exhaustiveCheck}`);
    }
  }

  return exporter.exportAndEncode();
};
