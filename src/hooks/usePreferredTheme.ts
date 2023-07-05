import {useColorScheme} from 'react-native';
import {useAppSelector} from '../redux/hooks';
import {useMemo} from 'react';
import {resolveTheme} from '../utils/global';

const usePreferredTheme = () => {
  const deviceTheme = useColorScheme();
  const appTheme = useAppSelector(state => state.theme);

  const preferredTheme = useMemo(() => {
    return resolveTheme(appTheme.theme, deviceTheme);
  }, [appTheme, deviceTheme]);

  return preferredTheme;
};

export default usePreferredTheme;
