import { render, screen } from '~/mocks/setup';
import ExportModal from '.';

vi.mock('~/utils', () => ({ exporter: vi.fn() }));

const renderExportModal = () => {
  const setOpenModal = vi.fn();
  const utils = render(
    <ExportModal isOpen mapName="My mindmap" setOpenModal={setOpenModal} />,
  );
  return { ...utils, setOpenModal };
};

describe('ExportModal', () => {
  it('lists image formats and shows the zoom option by default', async () => {
    const { user } = renderExportModal();

    // Format options are only rendered once the select is open
    await user.click(await screen.findByRole('combobox'));

    expect(
      screen.getByText('Portable Network Graphics (PNG)'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Freemind 1.0.1 (MM)')).not.toBeInTheDocument();
    expect(screen.getByLabelText('mindmap.export.zoom')).toBeInTheDocument();
  });

  it('lists mindmap tool formats without zoom option when switching group', async () => {
    const { user } = renderExportModal();

    await user.click(
      await screen.findByLabelText('mindmap.export.minmap.tools'),
    );
    await user.click(screen.getByRole('combobox'));

    expect(screen.getByText('Freemind 1.0.1 (MM)')).toBeInTheDocument();
    expect(
      screen.queryByText('Portable Network Graphics (PNG)'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('mindmap.export.zoom'),
    ).not.toBeInTheDocument();
  });

  it('closes the modal when clicking cancel', async () => {
    const { user, setOpenModal } = renderExportModal();

    await user.click(
      await screen.findByRole('button', { name: 'explorer.cancel' }),
    );

    expect(setOpenModal).toHaveBeenCalledWith(false);
  });
});
