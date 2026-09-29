import { ChangeEvent } from 'react';

import { act, renderHook, waitFor } from '~/mocks/setup';
import { exporter } from '~/utils';
import { useExportMindmap } from './useExportMindmap';

vi.mock('~/utils', () => ({ exporter: vi.fn() }));

const groupChangeEvent = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

const renderExportHook = () => {
  const onSuccess = vi.fn();
  const { result } = renderHook(() =>
    useExportMindmap({ mapName: 'My mindmap', onSuccess }),
  );
  return { result, onSuccess };
};

describe('useExportMindmap', () => {
  beforeEach(() => {
    // jsdom does not implement URL.revokeObjectURL
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('options', () => {
    it('selects wxml when switching to the mindmap-tool group', () => {
      const { result } = renderExportHook();

      act(() =>
        result.current.handleOnGroupChange(groupChangeEvent('mindmap-tool')),
      );

      expect(result.current.exportGroup).toBe('mindmap-tool');
      expect(result.current.exportFormat).toBe('wxml');
    });

    it('selects svg when switching back to the image group', () => {
      const { result } = renderExportHook();

      act(() =>
        result.current.handleOnGroupChange(groupChangeEvent('mindmap-tool')),
      );
      act(() => result.current.handleOnGroupChange(groupChangeEvent('image')));

      expect(result.current.exportGroup).toBe('image');
      expect(result.current.exportFormat).toBe('svg');
    });

    it('updates the format when another one is chosen', () => {
      const { result } = renderExportHook();

      act(() => result.current.handleOnExportFormatChange('png'));

      expect(result.current.exportFormat).toBe('png');
    });

    it('toggles zoomToFit', () => {
      const { result } = renderExportHook();
      const initialZoomToFit = result.current.zoomToFit;

      act(() => result.current.handleOnZoomToFit());

      expect(result.current.zoomToFit).toBe(!initialZoomToFit);
    });
  });

  describe('submit', () => {
    it('downloads the exported file and calls onSuccess', async () => {
      vi.mocked(exporter).mockResolvedValue('data:image/png;base64,abc');
      const click = vi
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(() => {});
      const { result, onSuccess } = renderExportHook();

      act(() => result.current.handleOnExportFormatChange('png'));
      act(() => result.current.handleOnZoomToFit());
      act(() => result.current.handleOnSubmit());

      await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
      const clickedAnchor = click.mock.contexts[0] as HTMLAnchorElement;
      expect(exporter).toHaveBeenCalledWith('png', false);
      expect(clickedAnchor.download).toBe('My mindmap.png');
      expect(clickedAnchor.href).toBe('data:image/png;base64,abc');
      expect(document.body.contains(clickedAnchor)).toBe(false);
    });

    it('does not call onSuccess when the export fails', async () => {
      vi.mocked(exporter).mockRejectedValue(new Error('export failed'));
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const { result, onSuccess } = renderExportHook();

      act(() => result.current.handleOnSubmit());

      await waitFor(() => expect(consoleError).toHaveBeenCalled());
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
