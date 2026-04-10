import { useEffect } from 'react';
import RNAlarmScheduler from 'react-native-alarm-scheduler';
import { updateRandomWidget } from '@/widgets/SoggyWidget';
import { setNextHourAlarm } from '@/tools/scheduler';

export function useSetAlarmsOnLaunch() {
  useEffect(() => {
    const setAlarms = async () => {
      await updateRandomWidget();
      const alarms = await RNAlarmScheduler.listAlarms();
      if (alarms && alarms.length > 0) {
        console.log('Clearing existing alarms...');
        const tasks = alarms.map(alarm => RNAlarmScheduler.cancelAlarm(alarm.id));
        await Promise.all(tasks);
      }
      console.log('Setting next hour alarm.');
      await setNextHourAlarm();
    };
    setAlarms();
  }, []);
}
