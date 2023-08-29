import { useEffect, useState } from "react";

import { exporter } from "~/services/utils";

type ExportFormat = "svg" | "jpg" | "png" | "mm" | "wxml";
type ExportGroup = "image" | "mindmap-tool";

export const useExportMindmap = ({
  mapName,
  onSuccess,
}: {
  mapName: string;
  onSuccess: () => void;
}) => {
  const [submit, setSubmit] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("jpg");
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

  useEffect(() => {
    if (submit) {
      exporter(exportFormat, zoomToFit)
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
          onSuccess?.();
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
