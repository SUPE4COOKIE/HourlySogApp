package expo.modules.soggywidget

import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class SoggyWidgetModule : Module() {
		private val context: Context get() = requireNotNull(appContext.reactContext)
		private val scope = CoroutineScope(Dispatchers.IO)

		override fun definition() = ModuleDefinition {
				Name("SoggyWidgetModule")

				AsyncFunction("startWidgetLoop") { uris: List<String> ->
						try {
							val prefs = context.getSharedPreferences("SoggyStorage", Context.MODE_PRIVATE)
							prefs.edit().putStringSet("available_images", uris.toSet()).apply()

							// immediately update the widget when syncing so it's not null until top of the hour
							scope.launch {
								SoggyAlarmReceiver.updateWidgetNatively(context)
							}

							SoggyAlarmReceiver.scheduleNextHourlyAlarm(context)
							return@AsyncFunction true
						} catch (e: Exception) {
							e.printStackTrace()
							return@AsyncFunction false
						}
				}
		}
}