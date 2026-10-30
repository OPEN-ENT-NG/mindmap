import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ImportModal from './ImportModal';

const { importState } = vi.hoisted(() => ({
  importState: { isPending: false },
}));

vi.mock('./useMindmapImport', () => ({
  useMindmapImport: () => ({
    mutate: vi.fn(),
    reset: vi.fn(),
    error: null,
    isPending: importState.isPending,
  }),
}));

vi.mock('@edifice.io/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@edifice.io/react')>()),
  useEdificeClient: () => ({ appCode: 'mindmap' }),
}));

const renderModal = () => {
  const onClose = vi.fn();
  render(<ImportModal isOpen onClose={onClose} />);
  return { onClose, user: userEvent.setup() };
};

describe('ImportModal', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="portal"></div>';
  });

  it('closes on Cancel when no import is running', async () => {
    importState.isPending = false;
    const { onClose, user } = renderModal();

    await user.click(screen.getByRole('button', { name: 'explorer.cancel' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('cannot be closed while an import is running', async () => {
    importState.isPending = true;
    const { onClose, user } = renderModal();

    expect(
      screen.getByRole('button', { name: 'explorer.cancel' }),
    ).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'close' }));
    await user.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
  });
});
