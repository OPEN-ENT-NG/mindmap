import { Suspense, lazy, useState } from 'react';

import { IFolder } from '@edifice.io/client';
import { Button, LoadingScreen, useEdificeClient } from '@edifice.io/react';
import { useTranslation } from 'react-i18next';

const ImportModal = lazy(async () => await import('./ImportModal'));

type ImportMindmapActionProps = {
  currentFolder?: Partial<IFolder>;
};

const ImportMindmapAction = ({ currentFolder }: ImportMindmapActionProps) => {
  const { t } = useTranslation();
  const { appCode } = useEdificeClient();
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
        {t('mindmap.import', { ns: appCode })}
      </Button>
      <Suspense fallback={<LoadingScreen />}>
        {isImportModalOpen && (
          <ImportModal
            isOpen={isImportModalOpen}
            currentFolder={currentFolder}
            onClose={() => setIsImportModalOpen(false)}
          />
        )}
      </Suspense>
    </>
  );
};

export default ImportMindmapAction;
