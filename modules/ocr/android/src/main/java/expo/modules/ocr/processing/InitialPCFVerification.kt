// processing/InitialPCFVerification.kt
package expo.modules.ocr.processing

import android.util.Log
import com.google.mlkit.vision.text.Text

class InitialPCFVerification(private val tag: String) {
    fun verifyRouteNumber(visionText: Text, expectedRoute: String): Boolean {
        var routeFound = false
        
        for (block in visionText.textBlocks) {
            for (line in block.lines) {
                val text = line.text.trim()
                
                // Log each line for debugging
                Log.d(tag, "Checking text: $text")
                
                // Check if this is a route number
                if (text.startsWith(expectedRoute)) {
                    routeFound = true
                    Log.d(tag, "Found matching route number: $text")
                    break
                }
                
                // Also check if route appears within line
                // (sometimes OCR combines text)
                if (text.contains(expectedRoute)) {
                    routeFound = true
                    Log.d(tag, "Found route number within text: $text")
                    break
                }
            }
            if (routeFound) break
        }

        return routeFound
    }
}