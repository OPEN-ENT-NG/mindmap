import { useEffect, useState } from "react";

import { Heading, Image, useOdeClient } from "@edifice-ui/react";
// @ts-ignore
import Editor, {
  Designer,
  ImageExporterFactory,
  useEditor,
} from "@edifice-wisemapping/editor";
import { odeServices } from "edifice-ts-client";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";

import { DEFAULT_MAP } from "~/config/default-map";
import { mapInfo, persistenceManager } from "~/features/mindmap/configuration";
import { MindmapProps } from "~/models/mindmap";
import { getMindmap } from "~/services/api";
import "./index.css";

export async function mapLoader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const data = await getMindmap(`/mindmap/${id}`);

  if (odeServices.http().isResponseError()) {
    throw new Response("", {
      status: odeServices.http().latestResponse.status,
      statusText: odeServices.http().latestResponse.statusText,
    });
  }

  return data.map
    ? data
    : {
        ...data,
        map: DEFAULT_MAP(data?.name),
      };
}

export const Mindmap = () => {
  const data = useLoaderData() as MindmapProps;
  const params = useParams();

  const [hrefImage, setHrefImage] = useState<string>("");

  const { currentLanguage } = useOdeClient();

  const editor = useEditor({
    mapInfo: mapInfo(data?.name, data?.name),
    options: {
      mode: "viewonly",
      locale: currentLanguage ?? "en",
      enableKeyboardEvents: false,
      enableAppBar: false,
      zoom: 1.5,
    },
    persistenceManager: persistenceManager(
      `/mindmap/${params?.id}`,
      data?.name,
    ),
  });

  useEffect(() => {
    //init pupetter config
    // @ts-ignore
    globalThis.pdfGeneratorConfig = {
      landscape: true,
    };
    // init designer
    // @ts-ignore
    const designer: Designer = globalThis.designer;
    designer.addEvent("loadSuccess", async () => {
      if (designer) {
        const workspace = designer.getWorkSpace();
        const svgElement = workspace.getSVGElement();
        const size = { width: window.innerWidth, height: window.innerHeight };
        const exporter = await ImageExporterFactory.create(
          "png",
          svgElement,
          size.width,
          size.height,
          true,
        );
        const imageData = await exporter.exportAndEncode();
        setHrefImage(imageData);
        setTimeout(() => window.print(), 1000);
      }
    });
  }, []);

  return (
    data?.map && (
      <div className="mindplot-div-container">
        {hrefImage ? (
          <>
            <Heading headingStyle="h1" level="h1" className="p-16">
              {data.name}
            </Heading>
            <div id="printpngwrapper">
              <Image id="printpng" src={hrefImage} alt="" />
            </div>
          </>
        ) : (
          <Editor editor={editor} />
        )}
      </div>
    )
  );
};
