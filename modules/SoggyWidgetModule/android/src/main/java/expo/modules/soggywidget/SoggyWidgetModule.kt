package expo.modules.soggywidget

import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SoggyWidgetModule : Module() {
		private val context: Context get() = requireNotNull(appContext.reactContext)

		override fun definition() = ModuleDefinition {
				Name("SoggyWidgetModule")

				AsyncFunction("startWidgetLoop") { uris: List<String> ->
						val prefs = context.getSharedPreferences("SoggyStorage", Context.MODE_PRIVATE)
						prefs.edit().putStringSet("available_images", uris.toSet()).apply()

						SoggyAlarmReceiver.scheduleNextHourlyAlarm(context)
				}
		}
}