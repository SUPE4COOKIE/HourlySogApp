import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { SoggyWidget, ClickSoggy, superRandomSoggy, getRandomSoggyImage, openSoggyImage } from './SoggyWidget';
import { getImageDimensions } from '@/tools/ImageSize';
import { setNextHourAlarm } from '@/tools/scheduler';

const nameToWidget = {
  SoggyCat: SoggyWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];

  const superRandomSog = false;//props.clickAction === 'SOGGY_CLICKED';
  const randomKey = superRandomSog ? superRandomSoggy() : getRandomSoggyImage();
  const imagePath = openSoggyImage(randomKey);

  let originalWidth = 400;
  let originalHeight = 600;

  try {
    if (typeof imagePath === 'string' && imagePath.startsWith('file://')) {
      const dimensions = await getImageDimensions(imagePath);
      originalWidth = dimensions.width;
      originalHeight = dimensions.height;
    }
  } catch (error) {
    console.log("Failed to get image size", error);
  }

  const widgetProps = {
    widgetInfo: props.widgetInfo,
    imagePath,
    originalWidth,
    originalHeight
  };

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
      props.renderWidget(<Widget {...widgetProps} />);
      setNextHourAlarm();
      break;

    case 'WIDGET_UPDATE':
      props.renderWidget(<Widget {...widgetProps} />);
      setNextHourAlarm();
      break;

    case 'WIDGET_RESIZED':
      props.renderWidget(<Widget {...widgetProps} />);
      break;

    case 'WIDGET_DELETED':
      // Not needed for now
      break;

    case 'WIDGET_CLICK':
      if (props.clickAction === 'SOGGY_CLICKED') {
        ClickSoggy(widgetProps);
      }
      break;

    default:
      break;
  }
}