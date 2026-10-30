import { getFolderId } from './useMindmapImport';

describe('getFolderId', () => {
  it.each([
    ['no current folder (search)', undefined, undefined],
    ['the root folder', { id: 'default' }, undefined],
    ['the trash', { id: 'bin' }, undefined],
    ['a folder', { id: '42' }, 42],
  ])('maps %s', (_, folder, expectedFolderId) => {
    expect(getFolderId(folder)).toBe(expectedFolderId);
  });
});
