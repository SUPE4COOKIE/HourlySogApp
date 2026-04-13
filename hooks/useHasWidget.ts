import { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import { getWidgetInfo } from 'react-native-android-widget';

export function useHasWidget() {
  const [hasWidget, setHasWidget] = useState<boolean>(false);

  useEffect(() => {
    const checkWidget = async () => {
      try {
        const widgets = await getWidgetInfo('SoggyCat');
        setHasWidget(widgets.length > 0);
      } catch (e) {
        console.log('Failed to check widget info', e);
        setHasWidget(false);
      }
    };
    checkWidget();
	
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkWidget();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return hasWidget;
}
