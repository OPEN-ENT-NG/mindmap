import { useEffect, useState } from "react";

import {
  Designer,
  ImageExporterFactory,
  Exporter,
  SizeType,
  TextExporterFactory,
  Mindmap,
} from "@edifice-wisemapping/editor";
import {
  Modal,
  Button,
  Radio,
  FormControl,
  Select,
  Checkbox,
} from "@ode-react-ui/components";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { fetchMindmap } from "~/services/appConfig";

interface ModalProps {
  isOpen: boolean;
  mapName: string;
  mapId: string | undefined;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type ExportFormat = "svg" | "jpg" | "png" | "mm" | "wxml";
type ExportGroup = "image" | "mindmap-tool";

export default function ExportModal({
  isOpen,
  mapName,
  mapId,
  onCancel = () => ({}),
}: ModalProps) {
  const { t } = useTranslation();
  const [submit, setSubmit] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("svg");
  const [exportGroup, setExportGroup] = useState<ExportGroup>("image");
  const [zoomToFit, setZoomToFit] = useState<boolean>(true);

  const handleOnSubmit = (): void => {
    setSubmit(true);
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
    if (designer != null) {
      // Depending on the type of export. It will require differt POST.
      const workspace = designer.getWorkSpace();
      svgElement = workspace.getSVGElement();
      size = { width: window.innerWidth, height: window.innerHeight };
      mindmap = designer.getMindmap();
    }
    // exporting from map list
    else {
      mindmap = await fetchMindmap(mapId);
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

  return createPortal(
    <Modal isOpen={isOpen} onModalClose={onCancel} id="exportModal">
      <Modal.Header onModalClose={onCancel}>
        {t("mindmap.export.modal.title")}
      </Modal.Header>
      <Modal.Body>
        <FormControl id="export">
          <Radio
            name="export-image"
            value="image"
            onChange={handleOnGroupChange}
            model={exportGroup}
            label="Export Image"
          />
          <FormControl id="image" className="form-div-center">
            {exportGroup == "image" && (
              <>
                <Select
                  onChange={handleOnExportFormatChange}
                  value={exportFormat}
                  options={[
                    {
                      label: "Scalable Vector Graphics (SVG)",
                      value: "svg",
                    },
                    {
                      label: "Portable Network Graphics (PNG)",
                      value: "png",
                    },
                    {
                      label: "JPEG Image (JPEG)",
                      value: "jpg",
                    },
                  ]}
                />
                <Checkbox
                  checked={zoomToFit}
                  label={t("mindmap.export.zoom")}
                  onChange={handleOnZoomToFit}
                />
              </>
            )}
          </FormControl>
          <Radio
            name="export-mindmap"
            value="mindmap-tool"
            onChange={handleOnGroupChange}
            model={exportGroup}
            label={t("mindmap.export.minmap.tools")}
          />
          <FormControl id="mindmap-tool" className="form-div-center">
            {exportGroup == "mindmap-tool" && (
              <>
                <Select
                  onChange={handleOnExportFormatChange}
                  value={exportFormat}
                  options={[
                    {
                      label: "WiseMapping (WXML)",
                      value: "wxml",
                    },
                    {
                      label: "Freemind 1.0.1 (MM)",
                      value: "mm",
                    },
                  ]}
                ></Select>
              </>
            )}
          </FormControl>
        </FormControl>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          {t("explorer.cancel")}
        </Button>
        <Button color="primary" variant="filled" onClick={handleOnSubmit}>
          {t("mindmap.export")}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById("portal") as HTMLElement,
  );
}
