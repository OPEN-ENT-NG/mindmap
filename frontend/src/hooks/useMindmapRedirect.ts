import { useEffect } from 'react';

import {
  useNavigate,
  useLocation,
  useNavigation,
  matchPath,
} from 'react-router-dom';

export const useMindmapRedirect = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  const ngLocation = location.hash.substring(1);

  const mindmap = matchPath('/view/:mindmapId', ngLocation);
  const mindmapPath = `/id/${mindmap?.params.mindmapId}`;

  const isLoading = navigation.state === 'loading';

  useEffect(() => {
    if (mindmap) navigate(mindmapPath);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading;
};
