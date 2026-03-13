import 'expo-router/entry';
import { widgetTaskHandler } from "@/widgets/widget-task-handler";
import { registerWidgetTaskHandler } from 'react-native-android-widget';

registerWidgetTaskHandler(widgetTaskHandler);