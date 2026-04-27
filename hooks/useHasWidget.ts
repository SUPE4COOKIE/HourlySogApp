import { useState, useEffect } from 'react';
import { AppState } from 'react-native';
// Temporarily bypassed as we have migrated to native Jetpack Glance widgets
// To re-enable, add a getInstalledWidgets hook to SoggyWidgetModule.

export function useHasWidget() {
  const [hasWidget, setHasWidget] = useState<boolean>(true);

  return hasWidget;
}
