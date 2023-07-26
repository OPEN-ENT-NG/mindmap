import { useEffect, useState } from "react";

import {
  Designer,
  ImageExporterFactory,
  Exporter,
  SizeType,
  TextExporterFactory,
  Mindmap,
  // @ts-ignore
} from "@edifice-wisemapping/editor";
import { Alert } from "@ode-react-ui/components";
import { useHotToast } from "@ode-react-ui/hooks";
import { useTranslation } from "react-i18next";

type ExportFormat = "svg" | "jpg" | "png" | "mm" | "wxml";
type ExportGroup = "image" | "mindmap-tool";

export const useExportMindmap = ({
  mapName,
  onSuccess,
}: {
  mapName: string;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();

  const [submit, setSubmit] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("svg");
  const [exportGroup, setExportGroup] = useState<ExportGroup>("image");
  const [zoomToFit, setZoomToFit] = useState<boolean>(true);
  const { hotToast } = useHotToast(Alert);

  const handleOnSubmit = (): void => {
    setSubmit(true);
    onSuccess?.();
  };

  const handleOnExportFormatChange = (event: any) => {
    setExportFormat(event.target.value);
  };

  const handleOnZoomToFit = (): void => {
    setZoomToFit(!zoomToFit);
  };

  const handleOnGroupChange = (event: any) => {
    const value: ExportGroup = event.target.value;
    setExportGroup(value);

    let defaultFormat: ExportFormat;
    switch (value) {
      case "image":
        defaultFormat = "svg";
        break;
      case "mindmap-tool":
        defaultFormat = "wxml";
        break;
    }
    setExportFormat(defaultFormat);
  };

  const exporter = async (formatType: ExportFormat): Promise<string> => {
    let svgElement: Element | null = null;
    let size: SizeType;
    let mindmap: Mindmap;

    const designer: Designer = globalThis.designer;
    // exporting from editor toolbar action
    if (designer) {
      // Depending on the type of export. It will require differt POST.
      const workspace = designer.getWorkSpace();
      svgElement = workspace.getSVGElement();
      size = { width: window.innerWidth, height: window.innerHeight };
      mindmap = designer.getMindmap();
    } else {
      hotToast.error(t("mindmap.export.failed"));
    }

    let exporter: Exporter;
    switch (formatType) {
      case "png":
      case "jpg":
      case "svg": {
        exporter = ImageExporterFactory.create(
          formatType,
          svgElement,
          size.width,
          size.height,
          zoomToFit,
        );
        break;
      }
      case "wxml":
      case "mm": {
        exporter = TextExporterFactory.create(formatType, mindmap);
        break;
      }
      default: {
        const exhaustiveCheck: never = formatType as never;
        throw new Error(`Unhandled color case: ${exhaustiveCheck}`);
      }
    }

    return exporter.exportAndEncode();
  };

  useEffect(() => {
    if (submit) {
      exporter(exportFormat)
        .then((url: string) => {
          // Create hidden anchor to force download ...
          const anchor: HTMLAnchorElement = document.createElement("a");
          anchor.style.display = "display: none";
          anchor.download = `${mapName}.${exportFormat}`;
          anchor.href = url;
          document.body.appendChild(anchor);

          // Trigger click ...
          anchor.click();

          // Clean up ...
          URL.revokeObjectURL(url);
          document.body.removeChild(anchor);
        })
        .catch((fail) => {
          console.error("Unexpected error during export:" + fail);
        });
    }
    setSubmit(false);
  }, [submit]);

  return {
    handleOnSubmit,
    handleOnExportFormatChange,
    handleOnZoomToFit,
    handleOnGroupChange,
    exportGroup,
    exportFormat,
    zoomToFit,
  };
};
