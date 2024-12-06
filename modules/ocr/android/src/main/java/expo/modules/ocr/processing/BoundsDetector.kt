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

    fun findHeaderAndFooterElements(visionText: Text): Map<String, String> {
        val headerFooterData = mutableMapOf<String, String>()

        var loadingDate: String? = null
        var deliveryNumber: String? = null
        var lastLoadingDatePos: Float? = null

        for (block in visionText.textBlocks) {
            for (line in block.lines) {
                val text = line.text.trim()
                val boundingBox = line.boundingBox ?: continue

                when {
                    text.contains("Loading Date", ignoreCase = true) -> {
                        lastLoadingDatePos = boundingBox.centerY().toFloat()
                        Log.d(tag, "Found 'Loading Date' label at y=${boundingBox.centerY()}")
                    }
                    text.contains("Delivery #", ignoreCase = true) -> {
                        deliveryNumber = extractNeighborText(visionText, boundingBox)
                        if (deliveryNumber != null) {
                            headerFooterData["Delivery #"] = deliveryNumber
                            Log.d(tag, "Found 'Delivery #' value: $deliveryNumber")
                        }
                    }
                    lastLoadingDatePos != null && isNearby(boundingBox.centerY().toFloat(), lastLoadingDatePos) -> {
                        loadingDate = text
                        headerFooterData["Loading Date"] = loadingDate
                        Log.d(tag, "Matched 'Loading Date' value: $loadingDate")
                        lastLoadingDatePos = null // Reset position once matched
                    }
                }
            }
        }

        return headerFooterData
    }

    private fun extractNeighborText(visionText: Text, currentBox: android.graphics.Rect): String? {
        for (block in visionText.textBlocks) {
            for (line in block.lines) {
                val text = line.text.trim()
                val boundingBox = line.boundingBox ?: continue

                if (isRightNeighbor(currentBox, boundingBox)) {
                    Log.d(tag, "Neighbor text for '${currentBox.flattenToString()}': $text")
                    return text
                }
            }
        }
        return null
    }

    private fun isNearby(y1: Float, y2: Float): Boolean {
        return Math.abs(y1 - y2) <= 15 // Allowable vertical proximity
    }

    private fun isRightNeighbor(currentBox: android.graphics.Rect, neighborBox: android.graphics.Rect): Boolean {
        return neighborBox.left > currentBox.right && 
               Math.abs(currentBox.centerY() - neighborBox.centerY()) <= 15 // Horizontal and vertical proximity
    }
}
