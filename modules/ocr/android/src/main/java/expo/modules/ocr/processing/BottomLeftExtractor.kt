package expo.modules.ocr.processing

import android.content.Context
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Log
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.Text
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException

class BottomLeftExtractor(private val context: Context) {
    private val tag = "BottomLeftExtractor"
    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

    fun extract(uri: String, promise: Promise) {
        try {
            val imageUri = Uri.parse(uri)
            val inputStream = context.contentResolver?.openInputStream(imageUri)
                ?: throw CodedException("Failed to open image")

            val bitmap = BitmapFactory.decodeStream(inputStream).also {
                inputStream.close()
            } ?: throw CodedException("Failed to decode image")

            val image = InputImage.fromBitmap(bitmap, 0)

            recognizer.process(image)
                .addOnSuccessListener { visionText ->
                    try {
                        val result = parseBottomLeft(visionText)
                        promise.resolve(result)
                    } catch (e: Exception) {
                        Log.e(tag, "Error parsing bottom-left data", e)
                        promise.reject(CodedException("Failed to parse bottom-left data: ${e.message}"))
                    }
                }
                .addOnFailureListener { e ->
                    promise.reject(CodedException("ML Kit OCR failed: ${e.message}"))
                }
        } catch (e: Exception) {
            promise.reject(CodedException("Failed to extract bottom-left data: ${e.message}"))
        }
    }

    private fun parseBottomLeft(visionText: Text): String {
        val result = mutableMapOf<String, String>()
        val lines = visionText.textBlocks.flatMap { it.lines }

        // Look for business name and route number in bottom-left
        lines.forEach { line ->
            val text = line.text.trim()
            if (text.matches(Regex("\\d{6}"))) {
                result["routeNumber"] = text
            } else if (text.contains(Regex("[A-Za-z&\\s]{3,}"))) {
                result["businessName"] = text
            }
        }

        return result.toString()
    }
}
