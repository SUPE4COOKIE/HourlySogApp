import { ToastAndroid } from 'react-native';
import RNAlarmModule from 'react-native-alarm-scheduler';
import { updateRandomWidget } from '@/widgets/SoggyWidget';

// Register the background function
RNAlarmModule.registerAlarmHeadlessTask(async (taskData) => {
    console.log("ALARM TRIGGERED IN BACKGROUND!", taskData);
    ToastAndroid.show(`Alarm fired: ${taskData.id}`, ToastAndroid.LONG);
    await updateRandomWidget();
    ToastAndroid.show(`Widget updated with new soggy cat!`, ToastAndroid.LONG);
    await setNextHourAlarm();
});

const getLocalISOString = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const getSoonISOString = (): string => {
    const soonDate = new Date(Date.now() + 10_000);
    const soon = getLocalISOString(soonDate);
    console.log('Scheduling alarm for:', soon);
    return soon;
};

const setNextHourAlarm = async () => {
    let nextHour = Math.floor(Date.now() / (60 * 60 * 1000)) * (60 * 60 * 1000);
    if (nextHour < Date.now()) {
        nextHour += 60 * 60 * 1000;
    }
    //let nextHour = Date.now() + 10_000; // for testing, set alarm for 10 seconds from now

    const alarmTime = getLocalISOString(new Date(nextHour));

    try {
        const alarms = await RNAlarmModule.listAlarms();
        if (alarms.some(alarm => alarm.id === alarmTime)) {
            console.log(`Alarm ${alarmTime} already exists. Skipping.`);
            return;
        }
    } catch (error) {
        console.error('Failed to list alarms:', error);
    }

    console.log('Scheduling next hour alarm for:', alarmTime);
    RNAlarmModule.scheduleAlarm({
        id: alarmTime,
        datetimeISO: alarmTime,
        title: 'Soggy cat widget update',
        body: '',
    });
};

export { setNextHourAlarm };