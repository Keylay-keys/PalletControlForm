// BoundsDetector.kt
package expo.modules.ocr.processing

import android.util.Log
import com.google.mlkit.vision.text.Text

class BoundsDetector(private val tag: String) {
    fun findDocumentBounds(visionText: Text): Pair<Float, Float> {
        var headerY = -1f
        var actualWords = Float.MAX_VALUE
        var footerY = Float.MAX_VALUE
        
        for (block in visionText.textBlocks) {
            for (line in block.lines) {
                val text = line.text.trim()
                when {
                    text.contains("Product", ignoreCase = true) -> {
                        headerY = line.boundingBox?.bottom?.toFloat()?.plus(10f) ?: headerY
                        if (headerY != -1f) {
                            Log.d(tag, "Found header boundary at y=$headerY and added 10 Pixels")
                        }
                    }
                    text.contains("The Pallet and the Plastic", ignoreCase = true) -> {
                        actualWords = line.boundingBox?.top?.toFloat() ?: actualWords
                        footerY = line.boundingBox?.top?.toFloat()?.minus(10f) ?: footerY
                        if (footerY != Float.MAX_VALUE) {
                            Log.d(tag, "The actual line is at y=$actualWords")
                            Log.d(tag, "10 Pixels above footer boundary at y=$footerY")
                        }
                    }
                }
            }
        }
        return Pair(headerY, footerY)
    }
}