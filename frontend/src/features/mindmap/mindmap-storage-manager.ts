// @ts-ignore
import { PersistenceManager } from "@edifice-wisemapping/editor";

import { updateMindmap } from "~/services/api";

class MindmapStorageManager extends PersistenceManager {
  private documentUrl: string;

  private mapName: string;

  constructor(documentUrl: string, mapName: string) {
    super();
    this.documentUrl = documentUrl;
    this.mapName = mapName;
  }

  saveMapXml(_mapId: string, mapDoc: Document): void {
    const mapXml = new XMLSerializer().serializeToString(mapDoc);

    const body = {
      name: this.mapName,
      map: mapXml,
    };

    updateMindmap(this.documentUrl, body);
  }

  loadMapDom(): Promise<Document> {
    const result: Promise<Document> = fetch(this.documentUrl, {
      method: "GET",
    })
      .then((response: Response) => {
        if (!response.ok) {
          console.error(`Response: ${response.status}`);
          throw new Error(
            `Response: ${response.status}, ${response.statusText}`,
          );
        }
        return response.json();
      })
      .then((data) => {
        return data.map;
      })
      .then((xmlStr) => new DOMParser().parseFromString(xmlStr, "text/xml"));

    return result;
  }
}

export default MindmapStorageManager;