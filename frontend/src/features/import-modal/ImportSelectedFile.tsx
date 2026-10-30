import { useEffect } from 'react';

import {
  Attachment,
  IconButton,
  useDropzoneContext,
  useEdificeClient,
} from '@edifice.io/react';
import { IconDelete } from '@edifice.io/react/icons';
import { useTranslation } from 'react-i18next';

type ImportSelectedFileProps = {
  disabled: boolean;
  onFileChange: (file: File | null) => void;
};

const ImportSelectedFile = ({
  disabled,
  onFileChange,
}: ImportSelectedFileProps) => {
  const { t } = useTranslation();
  const { appCode } = useEdificeClient();
  const { files, deleteFile } = useDropzoneContext();
  const file = files[0] ?? null;

  useEffect(() => {
    onFileChange(file);
  }, [file, onFileChange]);

  if (!file) return null;

  return (
    <Attachment
      name={file.name}
      options={
        <IconButton
          aria-label={t('mindmap.import.file.remove', { ns: appCode })}
          color="tertiary"
          icon={<IconDelete />}
          variant="ghost"
          disabled={disabled}
          onClick={() => deleteFile(file)}
        />
      }
    />
  );
};

export default ImportSelectedFile;
