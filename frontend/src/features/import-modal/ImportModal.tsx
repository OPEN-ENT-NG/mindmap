import { useCallback, useState } from 'react';

import { IFolder } from '@edifice.io/client';
import {
  Alert,
  Button,
  Dropzone,
  Modal,
  useEdificeClient,
} from '@edifice.io/react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import {
  ACCEPTED_IMPORT_EXTENSIONS,
  MAX_IMPORT_FILE_SIZE_MB,
} from './convert-mindmap-file';
import ImportSelectedFile from './ImportSelectedFile';
import {
  MindmapImportError,
  MindmapImportErrorCode,
} from './mindmap-import-error';
import { useMindmapImport } from './useMindmapImport';

const ERROR_I18N_KEYS: Record<MindmapImportErrorCode, string> = {
  UNSUPPORTED_FORMAT: 'mindmap.import.error.format',
  FILE_TOO_LARGE: 'mindmap.import.error.size',
  INVALID_CONTENT: 'mindmap.import.error.content',
};

const getErrorI18nKey = (error: Error) =>
  error instanceof MindmapImportError
    ? ERROR_I18N_KEYS[error.code]
    : 'mindmap.import.error';

type ImportModalProps = {
  isOpen: boolean;
  currentFolder?: Partial<IFolder>;
  onClose: () => void;
};

const ImportModal = ({ isOpen, currentFolder, onClose }: ImportModalProps) => {
  const { t } = useTranslation();
  const { appCode } = useEdificeClient();
  const [file, setFile] = useState<File | null>(null);
  const {
    mutate: importFile,
    reset,
    isPending,
    error,
  } = useMindmapImport(currentFolder);

  const handleFileChange = useCallback(
    (selectedFile: File | null) => {
      setFile(selectedFile);
      reset();
    },
    [reset],
  );

  const handleImport = () => {
    if (file) importFile(file);
  };

  // Closing does not stop an import: the map would still be created and opened.
  const handleClose = () => {
    if (!isPending) onClose();
  };

  return createPortal(
    <Modal isOpen={isOpen} onModalClose={handleClose} id="import-modal">
      <Modal.Header onModalClose={handleClose}>
        {t('mindmap.import.modal.title', { ns: appCode })}
      </Modal.Header>
      <Modal.Body>
        <p className="mb-12">
          {t('mindmap.import.formats', {
            ns: appCode,
            maxSize: MAX_IMPORT_FILE_SIZE_MB,
          })}
        </p>
        <Alert type="warning" className="mb-16">
          {t('mindmap.import.warning', { ns: appCode })}
        </Alert>
        {error ? (
          <Alert type="danger" className="mb-16">
            {t(getErrorI18nKey(error), {
              ns: appCode,
              maxSize: MAX_IMPORT_FILE_SIZE_MB,
            })}
          </Alert>
        ) : null}
        <Dropzone accept={ACCEPTED_IMPORT_EXTENSIONS} multiple={false}>
          {/* Locked during an import: a new file would reset the pending import. */}
          <ImportSelectedFile
            disabled={isPending}
            onFileChange={handleFileChange}
          />
        </Dropzone>
      </Modal.Body>
      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={handleClose}
          type="button"
          variant="ghost"
          disabled={isPending}
        >
          {t('explorer.cancel')}
        </Button>
        <Button
          color="primary"
          variant="filled"
          disabled={!file || isPending}
          isLoading={isPending}
          onClick={handleImport}
        >
          {t('mindmap.import', { ns: appCode })}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById('portal') as HTMLElement,
  );
};

export default ImportModal;
