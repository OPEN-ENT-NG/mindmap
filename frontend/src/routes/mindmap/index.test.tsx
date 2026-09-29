import { HttpResponse, http } from 'msw';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { mockMindmap, mockUserId } from '~/mocks';
import { server } from '~/mocks/server';
import { render, screen } from '~/mocks/setup';
import { useUserRightsStore } from '~/store';
import { Mindmap, loader } from '.';

const { save, useEditor } = vi.hoisted(() => {
  const save = vi.fn();
  return { save, useEditor: vi.fn(() => ({ model: { save } })) };
});

// The real editor cannot render in jsdom
vi.mock('@edifice-wisemapping/editor', () => ({
  default: () => <div data-testid="mindmap-editor" />,
  useEditor,
  PersistenceManager: class {},
}));

const renderMindmapPage = (rights: string[]) => {
  server.use(
    http.get('/mindmap/:id', () =>
      HttpResponse.json({ ...mockMindmap, rights }),
    ),
  );
  const router = createMemoryRouter(
    [{ path: '/id/:id', loader, element: <Mindmap /> }],
    {
      initialEntries: [`/id/${mockMindmap._id}`],
      future: { v7_relativeSplatPath: true },
    },
  );
  return render(
    <RouterProvider router={router} future={{ v7_startTransition: true }} />,
  );
};

const lastEditorMode = () =>
  (useEditor.mock.lastCall as unknown as [{ options: { mode: string } }])[0]
    .options.mode;

describe('Mindmap page', () => {
  beforeEach(() => {
    useUserRightsStore.getState().setUserRights({
      creator: false,
      contrib: false,
      manager: false,
      read: false,
    });
    vi.clearAllMocks();
  });

  describe('as a reader', () => {
    it('hides edition controls and opens the editor in view only mode', async () => {
      renderMindmapPage([`user:${mockUserId}:read`]);

      await screen.findByTestId('mindmap-editor');

      expect(
        screen.queryByRole('button', { name: 'mindmap.save' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'undo' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'redo' }),
      ).not.toBeInTheDocument();
      expect(lastEditorMode()).toBe('viewonly');
    });
  });

  describe('as a contributor', () => {
    it('shows edition controls and opens the editor in edition mode', async () => {
      renderMindmapPage([`user:${mockUserId}:contrib`]);

      await screen.findByTestId('mindmap-editor');

      expect(
        screen.getByRole('button', { name: 'mindmap.save' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'undo' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'redo' })).toBeInTheDocument();
      expect(lastEditorMode()).toBe('edition-owner');
    });

    it('saves the map when clicking save', async () => {
      const { user } = renderMindmapPage([`user:${mockUserId}:contrib`]);

      await user.click(
        await screen.findByRole('button', { name: 'mindmap.save' }),
      );

      expect(save).toHaveBeenCalledWith(true);
    });
  });

  it('opens the export modal when clicking export', async () => {
    const { user } = renderMindmapPage([`user:${mockUserId}:read`]);

    await user.click(
      await screen.findByRole('button', { name: 'mindmap.export' }),
    );

    expect(
      await screen.findByText('mindmap.export.modal.title'),
    ).toBeInTheDocument();
  });
});
