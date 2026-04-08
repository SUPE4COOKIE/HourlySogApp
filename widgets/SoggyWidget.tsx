'use no memo';
import React from 'react';
import { Image, ToastAndroid } from 'react-native';
import { FlexWidget, TextWidget, ImageWidget, requestWidgetUpdate } from 'react-native-android-widget';
import { storage } from "@/storage/mmkv";
import { Paths, File } from 'expo-file-system/next';
import seedrandom from 'seedrandom';
import getBestFit, { getImageDimensions } from '@/tools/ImageSize';

function getSyncRandomness(min: number, max: number): number {
  const now = Date.now();
  // round to nearest hour
  const msHour = 60 * 60 * 1000;
  const rounded = Math.floor(now / msHour) * msHour;
  const rng = seedrandom.alea(rounded.toString());

  // return seeded prng in range of min and max
  return Math.floor(rng() * (max - min + 1)) + min;
}

function superRandomSoggy() {
  const keys = storage.getAllKeys();
  if (keys.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}

function getRandomSoggyImage(): string | null {
  const keys = storage.getAllKeys();
  if (keys.length === 0) {
    return null;
  }
  
  const randomIndex = getSyncRandomness(0, keys.length - 1);
  return keys[randomIndex];
}

function ClickSoggy(props: any) {
  console.log('Soggy clicked!');
  ToastAndroid.show('Meow! Soggy clicked!', ToastAndroid.SHORT);
  console.log(props);
}

export function openSoggyImage(randomKey: string | null) {
  let imagePath: any = require('../assets/widget-preview/soggy.png');
  if (randomKey) {
    const file = new File(Paths.document, randomKey);
    imagePath = file.uri as any;
  }
  return imagePath;
}

const updateSuperRandomWidget = async () => {
    const randomKey = superRandomSoggy();
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

    requestWidgetUpdate({
      widgetName: 'SoggyCat',
      renderWidget: (widgetInfo) => <SoggyWidget widgetInfo={widgetInfo} imagePath={imagePath} originalWidth={originalWidth} originalHeight={originalHeight} />,
      widgetNotFound: () => {
        console.log('Widget not found');
      }
    });
  };

const updateRandomWidget = async () => {
  const randomKey = getRandomSoggyImage();
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

    requestWidgetUpdate({
      widgetName: 'SoggyCat',
      renderWidget: (widgetInfo) => <SoggyWidget widgetInfo={widgetInfo} imagePath={imagePath} originalWidth={originalWidth} originalHeight={originalHeight} />,
      widgetNotFound: () => {
        console.log('Widget not found');
      }
    });
};

function SoggyWidget({ widgetInfo, imagePath, originalWidth, originalHeight }: { widgetInfo?: any, imagePath?: any, originalWidth?: number, originalHeight?: number }) {
  const widgetWidth = widgetInfo?.width || 400;
  const widgetHeight = widgetInfo?.height || 600;

  const safeImagePath = imagePath || openSoggyImage(null);
  const safeOriginalWidth = originalWidth || 400;
  const safeOriginalHeight = originalHeight || 600;

  const { width, height } = getBestFit(safeOriginalWidth, safeOriginalHeight, widgetWidth, widgetHeight);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000000',
        borderRadius: 16,
      }}
      accessibilityLabel="Soggy Widget"
      clickAction="SOGGY_CLICKED"
    >
      <ImageWidget
        image={safeImagePath}
        imageWidth={width}
        imageHeight={height}
        style={{
          width: width,
          height: height,
        }}
      />
    </FlexWidget>
  );
}

export {SoggyWidget, ClickSoggy, superRandomSoggy, getRandomSoggyImage, updateSuperRandomWidget, updateRandomWidget};