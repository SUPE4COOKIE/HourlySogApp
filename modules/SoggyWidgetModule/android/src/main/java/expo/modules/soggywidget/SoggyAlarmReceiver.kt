package expo.modules.soggywidget

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import androidx.glance.appwidget.updateAll   // ← THIS was missing
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import java.util.Calendar
import java.util.Random

private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

class SoggyAlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == Intent.ACTION_MY_PACKAGE_REPLACED) {
            Log.d("SoggyAlarm", "Boot received, rescheduling alarm")
            scheduleNextHourlyAlarm(context)
            return
        }

        val pendingResult = goAsync()

        scope.launch {
            try {
                Log.d("SoggyAlarm", "Alarm fired, updating widget")
                updateWidgetNatively(context)
                scheduleNextHourlyAlarm(context)
            } catch (e: Exception) {
                Log.e("SoggyAlarm", "Error updating widget: ${e.message}", e)
            } finally {
                pendingResult.finish()
            }
        }
    }

    private suspend fun updateWidgetNatively(context: Context) {
        val prefs = context.getSharedPreferences("SoggyStorage", Context.MODE_PRIVATE)
        val keysList = prefs.getStringSet("available_images", emptySet())
            ?.sorted()
            ?: return

        if (keysList.isEmpty()) {
            Log.d("SoggyAlarm", "No images found in SharedPreferences, skipping update")
            return
        }

        val now = System.currentTimeMillis()
        val msHour = 60 * 60 * 1000L
        val roundedHour = (now / msHour) * msHour
        val seededRandom = Random(roundedHour)
        val randomIndex = seededRandom.nextInt(keysList.size)
        val cleanPath = keysList[randomIndex].replace("file://", "")

        Log.d("SoggyAlarm", "Updating widget with image: $cleanPath")

        val manager = GlanceAppWidgetManager(context)
        val glanceIds = manager.getGlanceIds(SoggyWidget::class.java)

        if (glanceIds.isEmpty()) {
            Log.d("SoggyAlarm", "No widget instances found on home screen, skipping")
            return
        }

        glanceIds.forEach { id ->
            updateAppWidgetState(context, id) { glancePrefs ->
                glancePrefs[stringPreferencesKey("soggy_image_path")] = cleanPath
            }
        }
        SoggyWidget().updateAll(context)
        Log.d("SoggyAlarm", "Widget updated successfully")
    }

    companion object {
        fun scheduleNextHourlyAlarm(context: Context) {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(context, SoggyAlarmReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val nextHour = Calendar.getInstance().apply {
                add(Calendar.HOUR_OF_DAY, 1)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, nextHour.timeInMillis, pendingIntent)
            } else {
                alarmManager.setExact(AlarmManager.RTC_WAKEUP, nextHour.timeInMillis, pendingIntent)
            }
            Log.d("SoggyAlarm", "Next alarm scheduled for: ${nextHour.time}")
        }
    }
}