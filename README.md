# PostBarRN
![license](https://img.shields.io/github/license/postbar/PostBarRN.svg)

（仿）百度贴吧，React Native FrontEnd

## Main Dependencies
+ `react`
+ `axios`
+ `react-native`
+ `@ant-design/react-native`
+ `react-native-elements`
+ `react-native-image-picker`
+ `react-native-image-zoom-viewer`
+ `react-native-scalable-image`
+ `react-native-splash-screen`
+ `react-native-vector-icons`
+ `react-navigation`

## Requirements
+ `Android SDK`
+ `NodeJs`
+ `Python2.7`
+ `JDK 1.8`

## Releases
+ [1.0](https://github.com/postbar/PostBarRN/releases/tag/1.0)

## Deploy

### Environment PreRequirements

Follow the [React Native Official Getting Started guide](https://facebook.github.io/react-native/docs/getting-started.html). 

### Deploy From Source

``` bash
git clone https://github.com/postbar/PostBarRN.git
cd PostBarRN
npm i
react-native run-android # for debug
cd android
gradlew assembleRelease # to build signed apk. Note: default signature is provided .PostBarRN//key/my-release-key.keystore
```
Generated jar package: `PostBarServer/target/pbserver-0.0.1-SNAPSHOT.jar`

### Or Download [`Release`](https://github.com/postbar/PostBarRN/releases/download/1.0/postbar1_0.apk)





## License

GPL-3.0

