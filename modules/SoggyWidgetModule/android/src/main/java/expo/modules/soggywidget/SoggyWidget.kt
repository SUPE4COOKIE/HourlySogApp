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
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.currentState
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.ContentScale
import androidx.glance.layout.fillMaxSize
import android.util.Log
import java.io.File

object SoggyPrefs {
    val IMAGE_PATH = stringPreferencesKey("soggy_image_path")
}

class SoggyWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            val prefs = currentState<Preferences>()
            val imagePath = prefs[SoggyPrefs.IMAGE_PATH]

            var imageProvider: ImageProvider = ImageProvider(R.drawable.undownloaded)

            if (imagePath != null) {
                Log.d("SoggyWidget", "Found imagePath in prefs: $imagePath")
                val file = File(imagePath)
                if (file.exists()) {
                    Log.d("SoggyWidget", "File exists: ${file.absolutePath}")

                    // scale bitmap down to avoid memory being > 1mb
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
                        Log.d("SoggyWidget", "Decoded bitmap: ${bitmap.width}x${bitmap.height}")

                        // system_app_widget_background_radius is capped at 28dp; Android 16+ uses 24dp.
                        //subtract a small inner padding offset (8dp) to get the correct inner radius
                        //   innerRadius = systemBackgroundRadius - widgetPadding
                        val density = context.resources.displayMetrics.density
                        val systemRadiusPx = try {
                            context.resources.getDimension(android.R.dimen.system_app_widget_background_radius)
                        } catch (e: Exception) {
                            // Fallback for launchers/devices that don't expose this dimen (pre-S)
                            28f * density
                        }
                        // 8dp inner padding offset — tune to taste (range: 4dp–12dp)
                        val widgetPaddingPx = 8f * density
                        val cornerRadiusPx = (systemRadiusPx - widgetPaddingPx).coerceAtLeast(8f * density)

                        //apply
                        val roundedBitmap = android.graphics.Bitmap.createBitmap(
                            bitmap.width, bitmap.height,
                            android.graphics.Bitmap.Config.ARGB_8888
                        )
                        val canvas = android.graphics.Canvas(roundedBitmap)
                        val paint = android.graphics.Paint().apply {
                            isAntiAlias = true
                            color = android.graphics.Color.WHITE
                        }
                        val rect = android.graphics.Rect(0, 0, bitmap.width, bitmap.height)
                        val rectF = android.graphics.RectF(rect)

                        // scale cornerRadiusPx from dp-space to bitmap pixel-space
                        val scaleX = bitmap.width.toFloat() / (reqWidth.toFloat())
                        val scaleY = bitmap.height.toFloat() / (reqHeight.toFloat())
                        val bitmapCornerRadius = cornerRadiusPx * ((scaleX + scaleY) / 2f)

                        canvas.drawRoundRect(rectF, bitmapCornerRadius, bitmapCornerRadius, paint)
                        paint.xfermode = android.graphics.PorterDuffXfermode(
                            android.graphics.PorterDuff.Mode.SRC_IN
                        )
                        canvas.drawBitmap(bitmap, rect, rect, paint)

                        imageProvider = ImageProvider(roundedBitmap)
                        Log.d("SoggyWidget", "Applied cornerRadius=${cornerRadiusPx}px (system=${systemRadiusPx}px)")
                    } else {
                        Log.e("SoggyWidget", "Failed to decode bitmap from ${file.absolutePath}")
                    }
                } else {
                    Log.e("SoggyWidget", "File does not exist: ${file.absolutePath}")
                }
            } else {
                Log.d("SoggyWidget", "imagePath is null, using fallback")
            }

            Box(
                modifier = GlanceModifier
                    .fillMaxSize()
                    .background(Color.Transparent)
                    .clickable(onClick = actionRunCallback<SoggyClickAction>()),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    provider = imageProvider,
                    contentDescription = "Soggy Cat",
                    contentScale = ContentScale.Fit,
                    modifier = GlanceModifier.fillMaxSize()
                )
            }
        }
    }
}