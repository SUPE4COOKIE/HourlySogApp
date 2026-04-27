package expo.modules.soggywidget

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import androidx.glance.appwidget.updateAll
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.Calendar
import java.util.Random

class SoggyAlarmReceiver : BroadcastReceiver() {

	override fun onReceive(context: Context, intent: Intent) {
		if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
			intent.action == Intent.ACTION_MY_PACKAGE_REPLACED) {
			scheduleNextHourlyAlarm(context)
			return
		}

		// avoid getting an ANR
		val pendingResult = goAsync()

		CoroutineScope(Dispatchers.IO).launch {
			try {
				updateWidgetNatively(context)
				scheduleNextHourlyAlarm(context)
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

		if (keysList.isEmpty()) return

		val now = System.currentTimeMillis()
		val msHour = 60 * 60 * 1000L
		val roundedHour = (now / msHour) * msHour

		//seeded the default random instead of the originally used alea
		val seededRandom = Random(roundedHour)
		val randomIndex = seededRandom.nextInt(keysList.size) // floor
		val randomKey = keysList[randomIndex]

		val cleanPath = randomKey.replace("file://", "")

		// Update the Glance widget state
		val manager = GlanceAppWidgetManager(context)
		val glanceIds = manager.getGlanceIds(SoggyWidget::class.java)

		glanceIds.forEach { id ->
			updateAppWidgetState(context, id) { glancePrefs ->
				glancePrefs[stringPreferencesKey("soggy_image_path")] = cleanPath
			}
		}

		SoggyWidget().updateAll(context) //retrigger provideGlance() for every soggyWidget
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
				// FLAG_UPDATE_CURRENT replace the intent if it already exists
				// FLAG_IMMUTABLE is required for Android 12+ so it cannot be modified once created
			)

			// Calculate the exact next top-of-the-hour
			val nextHour = Calendar.getInstance().apply {
				add(Calendar.HOUR_OF_DAY, 1)
				set(Calendar.MINUTE, 0)
				set(Calendar.SECOND, 0)
				set(Calendar.MILLISECOND, 0)
			}

			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
				alarmManager.setExactAndAllowWhileIdle(
					AlarmManager.RTC_WAKEUP,//wake up cpu if needed
					nextHour.timeInMillis,
					pendingIntent
				)
			} else {
				// default to setExact for older versions, which may be inexact on API 19-22
				alarmManager.setExact(
					AlarmManager.RTC_WAKEUP,
					nextHour.timeInMillis,
					pendingIntent
				)
			}
		}
	}
}