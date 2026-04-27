import { ConfigPlugin, withAndroidManifest } from '@expo/config-plugins';

const withSoggyWidget: ConfigPlugin = (config) => {
    return withAndroidManifest(config, (config) => {
        const manifest = config.modResults.manifest;
        const app = manifest.application![0];

        manifest['uses-permission'] = manifest['uses-permission'] || [];
        manifest['uses-permission'].push({ $: { 'android:name': 'android.permission.SCHEDULE_EXACT_ALARM' } });
        manifest['uses-permission'].push({ $: { 'android:name': 'android.permission.RECEIVE_BOOT_COMPLETED' } });

        app.receiver = app.receiver ?? [];

        // Note the `any` cast here to bypass the Expo TypeScript limitation
        const widgetReceiver: any = {
            $: { 
                'android:name': 'expo.modules.soggywidget.SoggyWidgetReceiver', 
                'android:exported': 'false' 
            },
            'intent-filter': [{ action: [{ $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } }] }],
            'meta-data': [{ 
                $: { 
                    'android:name': 'android.appwidget.provider', 
                    'android:resource': '@xml/soggy_widget_info' 
                } 
            }]
        };
        app.receiver.push(widgetReceiver);

        app.receiver.push({
            $: { 
                'android:name': 'expo.modules.soggywidget.SoggyAlarmReceiver', 
                'android:exported': 'true' 
            },
            'intent-filter': [{ 
                action: [
                    { $: { 'android:name': 'android.intent.action.BOOT_COMPLETED' } },
                    { $: { 'android:name': 'android.intent.action.MY_PACKAGE_REPLACED' } },
                    { $: { 'android:name': 'android.intent.action.QUICKBOOT_POWERON' } }
                ] 
            }]
        });

        return config;
    });
};

export default withSoggyWidget;