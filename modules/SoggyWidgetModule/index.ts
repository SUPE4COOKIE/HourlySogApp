// Reexport the native module. On web, it will be resolved to SoggyWidgetModule.web.ts
// and on native platforms to SoggyWidgetModule.ts
export { default } from './src/SoggyWidgetModule';
export { default as SoggyWidgetView } from './src/SoggyWidgetView';
export * from  './src/SoggyWidget.types';
