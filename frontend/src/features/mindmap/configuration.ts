import {
  EditorOptions,
  PersistenceManager,
  MapInfo,
  // @ts-ignore
} from '@edifice-wisemapping/editor';

import MapInfoImpl from '~/features/mindmap/MapInfoImpl';
import MindmapStorageManager from '~/features/mindmap/MindmapStorageManager';

export const mapInfo: MapInfo = (id: string, name: string): MapInfo =>
  new MapInfoImpl(id, name, false);

export const persistenceManager: PersistenceManager = (
  url: string,
  mapName: string,
): PersistenceManager => new MindmapStorageManager(url, mapName);

export const options: EditorOptions = (
  mode: string,
  locale: string,
  enableKeyboardEvents: boolean,
  enableAppBar: boolean,
): EditorOptions => {
  const options: EditorOptions = {
    mode,
    locale,
    enableKeyboardEvents,
    enableAppBar,
  };

  return options;
};
