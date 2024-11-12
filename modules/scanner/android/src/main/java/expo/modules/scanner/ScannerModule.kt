package expo.modules.scanner

import android.app.Activity.RESULT_OK
import android.widget.Toast
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions.RESULT_FORMAT_JPEG
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions.RESULT_FORMAT_PDF
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions.SCANNER_MODE_FULL
import com.google.mlkit.vision.documentscanner.GmsDocumentScanning
import com.google.mlkit.vision.documentscanner.GmsDocumentScanningResult
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.net.URL

class ScannerModule : Module() {
  private val options = GmsDocumentScannerOptions.Builder()
    .setGalleryImportAllowed(false)
    .setPageLimit(2)
    .setResultFormats(RESULT_FORMAT_JPEG, RESULT_FORMAT_PDF)
    .setScannerMode(SCANNER_MODE_FULL)
    .build()

  private val scanner = GmsDocumentScanning.getClient(options)

  private val context
    get() = requireNotNull(appContext.reactContext)

  private val activity 
    get() = requireNotNull(appContext.activityProvider?.currentActivity)

  val REQUEST_CODE = 10

  override fun definition() = ModuleDefinition {
    Name("Scanner")

    Events("onChange")

    AsyncFunction("scan") { promise: Promise ->
  try {
    scanner.getStartScanIntent(activity)
      .addOnSuccessListener { intentSender ->
        try {
          activity.startIntentSenderForResult(
            intentSender,
            REQUEST_CODE,
            null,
            0,
            0,
            0,
            null
          )
          promise.resolve(null)
        } catch (e: Exception) {
          promise.reject(
            "SCAN_ERROR", 
            "Failed to start scanner: ${e.message}",
            e
          )
        }
      }
      .addOnFailureListener { e ->
        promise.reject(
          "SCAN_ERROR",
          "Failed to get scan intent: ${e.message}",
          e
        )
      }
  } catch (e: Exception) {
    promise.reject(
      "SCAN_ERROR",
      "Scanner initialization failed: ${e.message}",
      e
    )
  }
}

    OnActivityResult { activity, onActivityResultPayload ->
      if (onActivityResultPayload.requestCode == REQUEST_CODE) {
        if (onActivityResultPayload.resultCode == RESULT_OK) {
          val docResult = GmsDocumentScanningResult.fromActivityResultIntent(onActivityResultPayload.data)
          docResult?.pages?.let { pages ->
            if (pages.isNotEmpty()) {
              val imageUri = pages[0].imageUri
              sendEvent("onChange", mapOf(
                "value" to imageUri.toString()
              ))
            }
          }
        } else {
          // Handle cancelled or failed scan
          sendEvent("onChange", mapOf(
            "error" to "Scan was cancelled or failed"
          ))
        }
      }
    }
  }
}