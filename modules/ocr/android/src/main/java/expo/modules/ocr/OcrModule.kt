package expo.modules.ocr

import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import com.google.mlkit.vision.text.Text
import org.json.JSONObject
import org.json.JSONArray
import kotlin.math.abs
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException

class OcrModule : Module() {  // Make sure it matches expo-module.config.json
    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
    private val TAG = "OcrModule"


    private data class DocumentDimensions(
        val width: Int,
        val height: Int,
        val columnRanges: Map<String, IntRange>,
        val lineSpacing: Int
    )

    private data class DocumentBoundaries(
        val productHeaderY: Int,
        val footerY: Int,
        val containerCode: String,
        val pageInfo: PageInfo
    )

    private data class PageInfo(
        val current: Int,
        val total: Int
    )

    private fun findNearestRow(
        rows: MutableMap<Int, MutableMap<String, String>>,
        y: Int,
        lineSpacing: Int
    ): Int {
        val nearestRow = rows.keys.firstOrNull { existingY ->
            abs(existingY - y) <= lineSpacing
        }
        return nearestRow ?: y
    }

    private fun calculateDocumentDimensions(
        imageWidth: Int,
        imageHeight: Int
    ): DocumentDimensions {
        val lineItemsHeight = imageHeight * 0.4
        val typicalLines = 20.0
        val averageLineHeight = lineItemsHeight / typicalLines
        val lineSpacing = (averageLineHeight * 0.5).toInt().coerceIn(15, 35)

        val columnRanges = mapOf(
            "product" to (0..(imageWidth * 0.1).toInt()),
            "description" to ((imageWidth * 0.1).toInt()..(imageWidth * 0.4).toInt()),
            "batch" to ((imageWidth * 0.4).toInt()..(imageWidth * 0.55).toInt()),
            "date" to ((imageWidth * 0.55).toInt()..(imageWidth * 0.7).toInt()),
            "rpType" to ((imageWidth * 0.7).toInt()..(imageWidth * 0.8).toInt()),
            "qty" to ((imageWidth * 0.8).toInt()..imageWidth)
        )

        Log.d(TAG, "Image dimensions: ${imageWidth}x${imageHeight}")
        Log.d(TAG, "Line spacing: $lineSpacing")
        Log.d(TAG, "Column ranges: $columnRanges")
        
        return DocumentDimensions(imageWidth, imageHeight, columnRanges, lineSpacing)
    }

    private fun findDocumentBoundaries(visionText: Text): DocumentBoundaries {
        var productHeaderY = -1
        var footerY = -1
        var containerCode = ""
        var pageInfo = PageInfo(1, 1)  // Default to single page

        for (block in visionText.textBlocks) {
            for (line in block.lines) {
                val text = line.text.trim()
                val y = line.boundingBox?.top ?: continue

                when {
                    text.lowercase().contains("product") && (productHeaderY == -1 || y < productHeaderY) -> {
                        productHeaderY = y
                        Log.d(TAG, "Found product header at y=$y")
                    }
                    text.lowercase().contains("the pallet and") && (footerY == -1 || y > footerY) -> {
                        footerY = y
                        Log.d(TAG, "Found footer at y=$y")
                    }
                    text.matches(Regex("\\d{15,}")) -> {
                        containerCode = text
                        Log.d(TAG, "Found container code: $text")
                    }
                    text.matches(Regex("Page:\\s*(\\d+)\\s*/\\s*(\\d+)")) -> {
                        val match = Regex("Page:\\s*(\\d+)\\s*/\\s*(\\d+)").find(text)
                        if (match != null) {
                            pageInfo = PageInfo(
                                match.groupValues[1].toInt(),
                                match.groupValues[2].toInt()
                            )
                            Log.d(TAG, "Found page info: ${match.groupValues[1]}/${match.groupValues[2]}")
                        }
                    }
                }
            }
        }

        return DocumentBoundaries(productHeaderY, footerY, containerCode, pageInfo)
    }

    override fun definition() = ModuleDefinition {
        Name("Ocr")  // This should match the name we use in JS/TS

        AsyncFunction("processImage") { uri: String, promise: Promise ->
            try {
                Log.d(TAG, "Processing image from URI: $uri")
                val imageUri = Uri.parse(uri)
                val inputStream = appContext.reactContext?.contentResolver?.openInputStream(imageUri)
                    ?: throw CodedException("Failed to open image")

                val bitmap = BitmapFactory.decodeStream(inputStream).also {
                    inputStream.close()
                } ?: throw CodedException("Failed to decode image")

                val dimensions = calculateDocumentDimensions(bitmap.width, bitmap.height)

                val image = InputImage.fromBitmap(bitmap, 0)
                Log.d(TAG, "Starting OCR processing")

                recognizer.process(image)
                    .addOnSuccessListener { visionText ->
                        try {
                            val result = JSONObject()
                            val lineItems = JSONArray()
                            val rows = mutableMapOf<Int, MutableMap<String, String>>()

                            val boundaries = findDocumentBoundaries(visionText)

                            if (boundaries.productHeaderY == -1) {
                                throw Exception("Could not find product section")
                            }

                            for (block in visionText.textBlocks) {
                                for (line in block.lines) {
                                    val boundingBox = line.boundingBox ?: continue
                                    val text = line.text.trim()
                                    val y = boundingBox.centerY().toInt()
                                    val x = boundingBox.left.toInt()

                                    if (y < boundaries.productHeaderY || 
                                        (boundaries.footerY != -1 && y > boundaries.footerY) || 
                                        text.matches(Regex(".*(TOTAL:|Units|Issue).*"))) continue

                                    Log.d(TAG, "Processing line: '$text' at x=$x, y=$y")

                                    val rowY = findNearestRow(rows, y, dimensions.lineSpacing)
                                    val row = rows.getOrPut(rowY) { mutableMapOf() }

                                    when {
                                        x in dimensions.columnRanges["product"]!! && 
                                        text.matches(Regex("^\\d{4,5}$")) -> {
                                            row["product"] = text
                                            Log.d(TAG, "Found product code: $text")
                                        }
                                        x in dimensions.columnRanges["description"]!! && 
                                        !text.matches(Regex(".*(quantity|description|batch|days|rp type).*", RegexOption.IGNORE_CASE)) && 
                                        !text.matches(Regex("[A-Z0-9]{8,12}")) -> {
                                            row["description"] = text
                                            Log.d(TAG, "Found description: $text")
                                        }
                                        text.matches(Regex(".*\\d{2}/\\d{2}/\\d{4}\\s+\\d+\\*?.*")) -> {
                                            val parts = text.split(Regex("\\s+"))
                                            if (parts.size >= 2) {
                                                row["bestBefore"] = parts[parts.size - 2]
                                                row["days"] = parts.last()
                                                Log.d(TAG, "Found date-days combo: date=${parts[parts.size - 2]}, days=${parts.last()}")
                                            }
                                        }
                                        text.matches(Regex("\\d{2}/\\d{2}/\\d{4}")) && 
                                        x in dimensions.columnRanges["date"]!! -> {
                                            row["bestBefore"] = text
                                            Log.d(TAG, "Found date: $text")
                                        }
                                        text.matches(Regex("\\d+\\*?")) && 
                                        x in dimensions.columnRanges["date"]!! && 
                                        row["bestBefore"] != null && 
                                        !text.matches(Regex("^[123]$")) -> {
                                            row["days"] = text
                                            Log.d(TAG, "Found days: $text")
                                        }
                                    }
                                }
                            }

                            val processedRows = mutableSetOf<Int>()
                            for ((y, row) in rows.toSortedMap()) {
                                if (y in processedRows) continue
                                
                                val nearbyRows = rows.filter { (otherY, _) -> 
                                    abs(otherY - y) <= dimensions.lineSpacing && otherY !in processedRows 
                                }
                                
                                val mergedRow = nearbyRows.values.fold(mutableMapOf<String, String>()) { acc, map ->
                                    acc.putAll(map)
                                    acc
                                }

                                if (mergedRow["product"] != null && mergedRow["description"] != null) {
                                    val item = JSONObject().apply {
                                        put("product", mergedRow["product"])
                                        put("description", mergedRow["description"])
                                        put("bestBefore", mergedRow["bestBefore"] ?: "")
                                        put("days", mergedRow["days"] ?: "")
                                    }
                                    lineItems.put(item)
                                    Log.d(TAG, "Added complete line item: $item")
                                }
                                
                                processedRows.addAll(nearbyRows.keys)
                            }

                            result.put("lineItems", lineItems)
                            result.put("containerCode", boundaries.containerCode)
                            promise.resolve(result.toString())
                        } catch (e: Exception) {
                            Log.e(TAG, "JSON processing error", e)
                            promise.reject(CodedException("Failed to process OCR results: ${e.message}"))
                        }
                    }
                    .addOnFailureListener { e ->
                        Log.e(TAG, "ML Kit OCR failed", e)
                        promise.reject(CodedException("ML Kit OCR failed: ${e.message}"))
                    }

            } catch (e: Exception) {
                promise.reject(CodedException("Failed to process image: ${e.message}"))
            }
        }
    }
}