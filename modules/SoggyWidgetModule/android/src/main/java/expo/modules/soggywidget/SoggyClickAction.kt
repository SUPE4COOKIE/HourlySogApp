package expo.modules.soggywidget

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import androidx.glance.GlanceId
import androidx.glance.action.ActionParameters
import androidx.glance.appwidget.action.ActionCallback

class SoggyClickAction : ActionCallback {
	override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
		Handler(Looper.getMainLooper()).post { // show toast on the main thread
			Toast.makeText(context, "Meow! Soggy clicked!", Toast.LENGTH_SHORT).show()
		}
	}
}