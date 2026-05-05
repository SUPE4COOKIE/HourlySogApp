package expo.modules.soggywidget

import androidx.glance.appwidget.GlanceAppWidgetReceiver

class SoggyWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget = SoggyWidget()
}