

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


class SoggyWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            // A simple red box with text. No image loading.
            androidx.glance.layout.Box(
                modifier = androidx.glance.GlanceModifier.fillMaxSize().background(androidx.compose.ui.graphics.Color.Red),
                contentAlignment = androidx.glance.layout.Alignment.Center
            ) {
                androidx.glance.text.Text(
                    text = "It works!",
                    style = androidx.glance.text.TextStyle(color = androidx.glance.unit.ColorProvider(androidx.compose.ui.graphics.Color.White))
                )
            }
        }
    }
}

/*
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
					val file = File(imagePath)
					if (file.exists()) {
						// save the file in a bitmap to feed the Image to the widget
						val bitmap = BitmapFactory.decodeFile(file.absolutePath)
						if (bitmap != null) {
							Image(
								provider = ImageProvider(bitmap),
								contentDescription = "Soggy Cat",
								contentScale = ContentScale.Fit,
								modifier = GlanceModifier.fillMaxSize()
							)
						}
					}
				}
			}
		}
	}
}
*/