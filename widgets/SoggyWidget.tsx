'use no memo';
import React from 'react';
import { ToastAndroid } from 'react-native';
import { FlexWidget, TextWidget, ImageWidget } from 'react-native-android-widget';
import { storage } from "@/storage/mmkv";
import { Paths } from 'expo-file-system/next';
import seedrandom from 'seedrandom';

function getSyncRandomness(min: number, max: number): number {
  const now = Date.now();
  // round to nearest hour
  const msHour = 60 * 60 * 1000;
  const rounded = Math.floor(now / msHour) * msHour;
  const rng = seedrandom.alea(rounded.toString());

  // return seeded prng in range of min and max
  return Math.floor(rng() * (max - min + 1)) + min;
}

function getRandomSoggyImage(): string | null {
  const keys = storage.getAllKeys();
  if (keys.length === 0) {
    return null;
  }
  
  const randomIndex = getSyncRandomness(0, keys.length - 1);
  return keys[randomIndex];
}

function ClickSoggy() {
  console.log('Soggy clicked!');
  ToastAndroid.show('Meow! Soggy clicked!', ToastAndroid.SHORT);
}

function SoggyWidget() {
  const randomKey = getRandomSoggyImage();
  let imagePath = require('../assets/widget-preview/soggy.png');

  if (randomKey) {
    imagePath = require(`${Paths.document.uri}/${randomKey}`);
  }

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
        image={imagePath}
        imageWidth={400}
        imageHeight={200}
      />
    </FlexWidget>
  );
}

export {SoggyWidget, ClickSoggy};