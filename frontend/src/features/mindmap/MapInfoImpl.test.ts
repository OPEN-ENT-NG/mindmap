import MapInfoImpl from './MapInfoImpl';

describe('MapInfoImpl', () => {
  it('exposes the id and title given at construction', () => {
    const mapInfo = new MapInfoImpl('map-1', 'My mindmap', false);

    expect(mapInfo.getId()).toBe('map-1');
    expect(mapInfo.getTitle()).toBe('My mindmap');
  });

  it('reflects the locked state given at construction', () => {
    expect(new MapInfoImpl('map-1', 'My mindmap', false).isLocked()).toBe(
      false,
    );
    expect(new MapInfoImpl('map-1', 'My mindmap', true).isLocked()).toBe(true);
  });

  it('uses a default zoom of 0.8', () => {
    const mapInfo = new MapInfoImpl('map-1', 'My mindmap', false);

    expect(mapInfo.getZoom()).toBe(0.8);
  });

  it('is starred by default and can be unstarred', async () => {
    const mapInfo = new MapInfoImpl('map-1', 'My mindmap', false);

    await expect(mapInfo.isStarred()).resolves.toBe(true);

    await mapInfo.updateStarred(false);

    await expect(mapInfo.isStarred()).resolves.toBe(false);
  });
});
