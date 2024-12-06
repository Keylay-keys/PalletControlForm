package expo.modules.ocr

import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import org.json.JSONObject
import org.json.JSONArray
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.ocr.preprocessing.ImageProcessor
import expo.modules.ocr.processing.*

class OcrModule : Module() {
    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
    private val tag = "OcrModule"
    private val imageProcessor = ImageProcessor()
    private val boundsDetector = BoundsDetector(tag)
    private val lineItemCollector = LineItemCollector(tag)
    private val lineItemProcessor = LineItemProcessor(tag)

    override fun definition() = ModuleDefinition {
        Name("Ocr")

        AsyncFunction("processImage") { uri: String, promise: Promise ->
            try {
                val imageUri = Uri.parse(uri)
                val inputStream = appContext.reactContext?.contentResolver?.openInputStream(imageUri)
                    ?: throw CodedException("Failed to open image")

                val bitmap = BitmapFactory.decodeStream(inputStream).also {
                    inputStream.close()
                } ?: throw CodedException("Failed to decode image")

                Log.d(tag, "Image dimensions: ${bitmap.width}x${bitmap.height}")

                val grayscaleBitmap = imageProcessor.convertToGrayscale(bitmap)
                val processedBitmap = imageProcessor.applyBinarization(grayscaleBitmap)
                val image = InputImage.fromBitmap(processedBitmap, 0)

                recognizer.process(image)
                    .addOnSuccessListener { visionText ->
                        try {
                            // Get line item bounds
                            val (headerY, footerY) = boundsDetector.findDocumentBounds(visionText)
                            Log.d(tag, "Document bounds: header=$headerY, footer=$footerY")

                            // Collect and process line items
                            val lineItems = lineItemCollector.collectLineItems(visionText, headerY, footerY)
                            val processedItems = lineItemProcessor.processLineItems(lineItems)

                            // Find header and footer elements
                            val headerAndFooterElements = boundsDetector.findHeaderAndFooterElements(visionText)
                            headerAndFooterElements.forEach { (key, value) ->
                                Log.d(tag, "$key: $value")
                            }

                            // Create result
                            val result = JSONObject()
                            val itemsArray = JSONArray()
                            processedItems.forEach { item ->
                                itemsArray.put(JSONObject().apply {
                                    put("product", item.product)
                                    put("description", item.description)
                                    put("batch", item.batch ?: JSONObject.NULL)
                                    put("bestBefore", item.bestBefore ?: JSONObject.NULL)
                                    put("days", item.days ?: JSONObject.NULL)
                                })
                                Log.d(tag, "Added to result: Product=${item.product}, Description=${item.description}, Best Before=${item.bestBefore}, Days=${item.days}")
                            }

                            // Add header and footer data to result
                            val headerFooterJson = JSONObject(headerAndFooterElements)
                            result.put("lineItems", itemsArray)
                            result.put("headerFooter", headerFooterJson)

                            Log.d(tag, "Processed ${processedItems.size} line items")
                            promise.resolve(result.toString())

                        } catch (e: Exception) {
                            Log.e(tag, "Processing error", e)
                            promise.reject(CodedException("Failed to process text: ${e.message}"))
                        }
                    }
                    .addOnFailureListener { e ->
                        promise.reject(CodedException("ML Kit OCR failed: ${e.message}"))
                    }

            } catch (e: Exception) {
                promise.reject(CodedException("Failed to process image: ${e.message}"))
            }
        }

        AsyncFunction("verifyRouteNumber") { uri: String, routeNumber: String, promise: Promise ->
            try {
                val imageUri = Uri.parse(uri)
                val inputStream = appContext.reactContext?.contentResolver?.openInputStream(imageUri)
                    ?: throw CodedException("Failed to open image")

                val bitmap = BitmapFactory.decodeStream(inputStream).also {
                    inputStream.close()
                } ?: throw CodedException("Failed to decode image")

                val grayscaleBitmap = imageProcessor.convertToGrayscale(bitmap)
                val processedBitmap = imageProcessor.applyBinarization(grayscaleBitmap)
                val image = InputImage.fromBitmap(processedBitmap, 0)

                val routeVerification = InitialPCFVerification(tag)

                recognizer.process(image)
                    .addOnSuccessListener { visionText ->
                        try {
                            val isRouteValid = routeVerification.verifyRouteNumber(visionText, routeNumber)

                            val result = JSONObject().apply {
                                put("isValid", isRouteValid)
                            }

                            Log.d(tag, "Route verification result: $isRouteValid for route $routeNumber")
                            promise.resolve(result.toString())

                        } catch (e: Exception) {
                            Log.e(tag, "Route verification error", e)
                            promise.reject(CodedException("Failed to verify route: ${e.message}"))
                        }
                    }
                    .addOnFailureListener { e ->
                        promise.reject(CodedException("ML Kit OCR failed: ${e.message}"))
                    }

            } catch (e: Exception) {
                promise.reject(CodedException("Failed to process image: ${e.message}"))
            }
        }
    }
}
