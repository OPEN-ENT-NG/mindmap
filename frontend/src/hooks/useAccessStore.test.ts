import { renderHook } from '~/mocks/setup';
import { useUserRightsStore } from '~/store';
import { useAccessStore } from './useAccessStore';

const noRights = {
  creator: false,
  contrib: false,
  manager: false,
  read: false,
};

const renderWithRights = (rights: Partial<typeof noRights>) => {
  useUserRightsStore.getState().setUserRights({ ...noRights, ...rights });
  return renderHook(() => useAccessStore()).result;
};

describe('useAccessStore', () => {
  beforeEach(() => {
    useUserRightsStore.getState().setUserRights(noRights);
  });

  it.each(['creator', 'contrib', 'manager'] as const)(
    'allows update for a %s',
    (right) => {
      const result = renderWithRights({ read: true, [right]: true });

      expect(result.current.canUpdate).toBe(true);
    },
  );

  it('denies update with the read right only', () => {
    const result = renderWithRights({ read: true });

    expect(result.current.canUpdate).toBe(false);
  });

  it('denies update without any right', () => {
    const result = renderWithRights({});

    expect(result.current.canUpdate).toBe(false);
  });

  it('exposes the rights from the store', () => {
    const result = renderWithRights({ read: true, contrib: true });

    expect(result.current.userRights).toEqual({
      ...noRights,
      read: true,
      contrib: true,
    });
  });
});
