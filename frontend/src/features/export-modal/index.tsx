import {
  Modal,
  Button,
  Radio,
  FormControl,
  Select,
  Checkbox,
  useOdeClient,
} from "@edifice-ui/react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { useExportMindmap } from "./useExportMindmap";

interface ModalProps {
  isOpen: boolean;
  mapName: string;
  setOpenModal: (isOpen: boolean) => void;
}

export default function ExportModal({
  isOpen,
  mapName,
  setOpenModal,
}: ModalProps) {
  const { t } = useTranslation();
  const { appCode } = useOdeClient();

  const handleOnCancel = () => {
    setOpenModal(false);
  };

  const {
    imagesOptions,
    formatOptions,
    handleOnSubmit,
    handleOnExportFormatChange,
    handleOnZoomToFit,
    handleOnGroupChange,
    exportGroup,
    exportFormat,
    zoomToFit,
  } = useExportMindmap({ mapName, onSuccess: handleOnCancel });

  return createPortal(
    <Modal isOpen={isOpen} onModalClose={handleOnCancel} id="export-modal">
      <Modal.Header onModalClose={handleOnCancel}>
        {t("mindmap.export.modal.title", { ns: appCode })}
      </Modal.Header>
      <Modal.Body>
        <FormControl id="export">
          <Radio
            name="export-image"
            value="image"
            onChange={handleOnGroupChange}
            model={exportGroup}
            checked={exportGroup === "image"}
            label={t("mindmap.export.image", { ns: appCode })}
          />
          <FormControl id="image" className="form-div-center">
            {exportGroup == "image" && (
              <>
                <Select
                  block
                  size="md"
                  onValueChange={handleOnExportFormatChange}
                  options={imagesOptions}
                  aria-required={true}
                  placeholderOption={imagesOptions[0].label}
                />
                <Checkbox
                  checked={zoomToFit}
                  label={t("mindmap.export.zoom", { ns: appCode })}
                  onChange={handleOnZoomToFit}
                  className="my-8"
                />
              </>
            )}
          </FormControl>
          <Radio
            name="export-mindmap"
            value="mindmap-tool"
            onChange={handleOnGroupChange}
            model={exportGroup}
            checked={exportGroup === "mindmap-tool"}
            label={t("mindmap.export.minmap.tools", { ns: appCode })}
          />
          <FormControl id="mindmap-tool" className="form-div-center">
            {exportGroup == "mindmap-tool" && (
              <>
                <Select
                  block
                  size="md"
                  onValueChange={handleOnExportFormatChange}
                  options={formatOptions}
                  placeholderOption={exportFormat}
                />
              </>
            )}
          </FormControl>
        </FormControl>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={handleOnCancel}
          type="button"
          variant="ghost"
        >
          {t("explorer.cancel")}
        </Button>
        <Button color="primary" variant="filled" onClick={handleOnSubmit}>
          {t("mindmap.export", { ns: appCode })}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById("portal") as HTMLElement,
  );
}
