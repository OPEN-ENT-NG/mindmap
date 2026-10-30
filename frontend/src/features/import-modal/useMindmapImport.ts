import { CreateResult, IFolder, odeServices } from '@edifice.io/client';
import { useEdificeClient } from '@edifice.io/react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { MindmapResourceService } from '~/services/resource';

import { convertMindmapFile, getMapName } from './convert-mindmap-file';

// The explorer root ("default") and trash ("bin") folders are not real
// folders, and there is no current folder while searching.
export const getFolderId = (folder?: Partial<IFolder>): number | undefined => {
  if (!folder?.id) return undefined;
  const folderId = Number(folder.id);
  return Number.isInteger(folderId) ? folderId : undefined;
};

export const useMindmapImport = (currentFolder?: Partial<IFolder>) => {
  const { appCode } = useEdificeClient();
  const navigate = useNavigate();

  return useMutation<CreateResult, Error, File>({
    mutationFn: async (file) =>
      new MindmapResourceService(odeServices).create({
        application: appCode,
        name: getMapName(file),
        description: '',
        thumbnail: '',
        folder: getFolderId(currentFolder),
        map: await convertMindmapFile(file),
      }),
    onSuccess: ({ entId }) => navigate(`/id/${entId}`),
  });
};
