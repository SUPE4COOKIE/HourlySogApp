import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { SoggyWidget, ClickSoggy } from './SoggyWidget';

const nameToWidget = {
  SoggyCat: SoggyWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_UPDATE':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_RESIZED':
      props.renderWidget(<Widget />);
      break;

    case 'WIDGET_DELETED':
      // Not needed for now
      break;

    case 'WIDGET_CLICK':
      if (props.clickAction === 'SOGGY_CLICKED') {
        ClickSoggy();
        props.renderWidget(<Widget />);
      }
      break;

    default:
      break;
  }
}