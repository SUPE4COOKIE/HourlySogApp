'use no memo';
import React from 'react';
import { ToastAndroid } from 'react-native';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';
import { storage } from "@/storage/mmkv";

/*select random image from mmkv and then use it as the widget image*/

function getSyncRandomness(min: number, max: number): number {
  return (1);
}

function getRandomSoggyImage(): string | null {
  const keys = storage.getAllKeys();
  return (null);
}

function ClickSoggy() {
  console.log('Soggy clicked!');
  ToastAndroid.show('Meow! Soggy clicked!', ToastAndroid.SHORT);
}

function SoggyWidget() {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
      }}
      accessibilityLabel="Soggy Widget"
      clickAction="SOGGY_CLICKED"
    >
      <ImageWidget
        image={require('../assets/widget-preview/soggy.png')}
        imageWidth={400}
        imageHeight={200}
      />
    </FlexWidget>
  );
}

export {SoggyWidget, ClickSoggy};