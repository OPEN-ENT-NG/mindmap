import {
  LocalStorageManager,
  Mindmap,
  XMLSerializerFactory,
} from "@edifice-wisemapping/editor";

interface Config {
  apiBaseUrl: string;
  analyticsAccount?: string;
  recaptcha2Enabled: boolean;
  recaptcha2SiteKey?: string;
  clientType: "mock" | "rest";
  googleOauth2Url: string;
}
class _AppConfig {
  private defaultInstance: Config = {
    apiBaseUrl: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    clientType: "mock",
    recaptcha2Enabled: true,
    recaptcha2SiteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    googleOauth2Url: "/c/registration-google?code=aFakeCode",
  };

  private getInstance(): Config {
    // Config can be inserted in the html page to define the global properties ...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result = (window as any).serverconfig;
    if (!result) {
      result = this.defaultInstance;
    }

    return result;
  }

  isRestClient(): boolean {
    const config = this.getInstance();
    return config.clientType === "rest";
  }
}

const AppConfig = new _AppConfig();

export const fetchMindmap = async (
  mapId: string | undefined,
): Promise<Mindmap> => {
  let mindmap: Mindmap;
  if (AppConfig.isRestClient()) {
    const persistence = new LocalStorageManager(
      `/c/restful/maps/{id}/document/xml`,
      true,
    );
    mindmap = await persistence.load(String(mapId));
  } else {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(
      `
                  <map name="${mapId}" version="tango">
                      <topic central="true" text="This is the map ${mapId}" id="1" fontStyle=";;#ffffff;;;"></topic>
                  </map>
                  `,
      "text/xml",
    );

    const serializer = XMLSerializerFactory.getSerializer("tango");
    mindmap = Promise.resolve(serializer.loadFromDom(xmlDoc, String(mapId)));
  }
  return mindmap;
};
