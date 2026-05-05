package expo.modules.soggywidget

import android.appwidget.AppWidgetManager
import android.content.Context
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

private val receiverScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

class SoggyWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget = SoggyWidget()

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        super.onUpdate(context, appWidgetManager, appWidgetIds)
        // Ensure that newly placed widgets get the current image immediately
        receiverScope.launch {
            SoggyAlarmReceiver.updateWidgetNatively(context)
        }
    }
}