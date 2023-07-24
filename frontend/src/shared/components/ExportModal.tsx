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

import useExportMindmap from "../hooks/useExportMindmap";

interface ModalProps {
  isOpen: boolean;
  mapName: string;
  onCancel?: () => void;
}

export default function ExportModal({
  isOpen,
  mapName,
  onCancel = () => ({}),
}: ModalProps) {
  const { t } = useTranslation();

  const {
    handleOnSubmit,
    handleOnExportFormatChange,
    handleOnZoomToFit,
    handleOnGroupChange,
    exportGroup,
    exportFormat,
    zoomToFit,
  } = useExportMindmap({ mapName });

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
