
# Hourly Sog App

This app aims at providing a synchronised random offline 
soggy cat every hour Widget, to do so it use a predicive seed for a PRNG algorithm .


## Android status:

- async downloads from mirror.guweh.com + updates checks

- used MMKV to track already installed pictures that are stored in the cache

- Widgets implemented via react-native-android-widget library

- used Alea algorithm from Johannes Baagøe re-seeded with UTC+0 hour timestamp at every generation

- bypassed the limited widget updates using AlarmManager.setExactAndAllowWhileIdle() to wake a Headless JS task at precise XX:00 intervals, which then updates the widget. The implementation was partially done by a [small alarm library in Kotlin](https://github.com/SUPE4COOKIE/react-native-alarm-scheduler) which i reviewed and modified for this purpose

## IOS status:
i haven't already started the IOS implementation but downloads, cache managing and randomness should be cross platform





## Building

**Android:**
```bash
  git clone https://github.com/SUPE4COOKIE/HourlySogApp
  cd HourlySogApp
  npm install
  npx expo prebuild --platform android 
  cd android
  ./gradlew assembleRelease # JDK version must be 17
```



