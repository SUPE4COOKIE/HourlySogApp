

package expo.modules.soggywidget

import android.content.Context
import android.graphics.BitmapFactory
import androidx.compose.ui.graphics.Color
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.Image
import androidx.glance.ImageProvider
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.action.actionRunCallback
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.currentState
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.ContentScale
import androidx.glance.layout.fillMaxSize
import androidx.compose.ui.unit.dp
import java.io.File



import android.util.Log

object SoggyPrefs {
	// saved random image from the saved preferences, modified by the alarm receiver
	val IMAGE_PATH = stringPreferencesKey("soggy_image_path")
}

class SoggyWidget : GlanceAppWidget() {
	override suspend fun provideGlance(context: Context, id: GlanceId) {
		provideContent {
			val prefs = currentState<Preferences>()
			val imagePath = prefs[SoggyPrefs.IMAGE_PATH]

			Box(
				modifier = GlanceModifier
					.fillMaxSize()
					.background(Color.Transparent)
					.cornerRadius(16.dp)
					.clickable(onClick = actionRunCallback<SoggyClickAction>()),
				contentAlignment = Alignment.Center
			) {
				if (imagePath != null) {
					Log.d("SoggyWidget", "Found imagePath in prefs: $imagePath")
					val file = File(imagePath)
					if (file.exists()) {
						Log.d("SoggyWidget", "File exists: ${file.absolutePath}")
						
						// App Widgets have strict memory limits for images (part of Binder Transaction limits).
						// We need to scale the bitmap down. 500x500 is a safe maximum for widgets.
						val options = BitmapFactory.Options()
						options.inJustDecodeBounds = true
						BitmapFactory.decodeFile(file.absolutePath, options)
						
						val reqWidth = 500
						val reqHeight = 500
						var inSampleSize = 1
						
						if (options.outHeight > reqHeight || options.outWidth > reqWidth) {
							val halfHeight: Int = options.outHeight / 2
							val halfWidth: Int = options.outWidth / 2
							while (halfHeight / inSampleSize >= reqHeight && halfWidth / inSampleSize >= reqWidth) {
								inSampleSize *= 2
							}
						}
						
						options.inJustDecodeBounds = false
						options.inSampleSize = inSampleSize
						
						val bitmap = BitmapFactory.decodeFile(file.absolutePath, options)
						if (bitmap != null) {
							Log.d("SoggyWidget", "Successfully decoded and scaled bitmap to size: ${bitmap.width}x${bitmap.height}")
							Image(
								provider = ImageProvider(bitmap),
								contentDescription = "Soggy Cat",
								contentScale = ContentScale.Fit,
								modifier = GlanceModifier.fillMaxSize()
							)
						} else {
							Log.e("SoggyWidget", "Failed to decode bitmap from ${file.absolutePath}")
						}
					} else {
						Log.e("SoggyWidget", "File does not exist: ${file.absolutePath}")
					}
				} else {
					Log.d("SoggyWidget", "imagePath in prefs is null, using fallback image")
					Image(
						provider = ImageProvider(R.drawable.undownloaded),
						contentDescription = "Soggy Cat",
						contentScale = ContentScale.Fit,
						modifier = GlanceModifier.fillMaxSize()
					)
				}
			}
		}
	}
}
