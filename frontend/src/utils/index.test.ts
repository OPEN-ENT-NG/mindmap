import { exporter } from '.';

const { imageCreate, textCreate } = vi.hoisted(() => ({
  imageCreate: vi.fn(),
  textCreate: vi.fn(),
}));

vi.mock('@edifice-wisemapping/editor', () => ({
  ImageExporterFactory: { create: imageCreate },
  TextExporterFactory: { create: textCreate },
}));

const svgElement = document.createElementNS(
  'http://www.w3.org/2000/svg',
  'svg',
);
const mindmap = { id: 'mindmap' };

describe('exporter', () => {
  beforeEach(() => {
    imageCreate.mockReturnValue({
      exportAndEncode: () => Promise.resolve('image-url'),
    });
    textCreate.mockReturnValue({
      exportAndEncode: () => Promise.resolve('text-url'),
    });
    // @ts-ignore
    globalThis.designer = {
      getWorkSpace: () => ({ getSVGElement: () => svgElement }),
      getMindmap: () => mindmap,
    };
  });

  afterEach(() => {
    // @ts-ignore
    delete globalThis.designer;
    vi.clearAllMocks();
  });

  it.each(['png', 'jpg', 'svg'] as const)(
    'exports %s through the image exporter with the zoomToFit option',
    async (format) => {
      const url = await exporter(format, false);

      expect(url).toBe('image-url');
      expect(imageCreate).toHaveBeenCalledWith(
        format,
        svgElement,
        window.innerWidth,
        window.innerHeight,
        false,
      );
      expect(textCreate).not.toHaveBeenCalled();
    },
  );

  it.each(['mm', 'wxml'] as const)(
    'exports %s through the text exporter',
    async (format) => {
      const url = await exporter(format, true);

      expect(url).toBe('text-url');
      expect(textCreate).toHaveBeenCalledWith(format, mindmap);
      expect(imageCreate).not.toHaveBeenCalled();
    },
  );
});
