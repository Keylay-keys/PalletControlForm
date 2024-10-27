package expo.modules.mymodule

import android.app.Activity.RESULT_OK
import android.content.Intent
import android.widget.Toast
import androidx.core.content.FileProvider
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions.RESULT_FORMAT_JPEG
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions.RESULT_FORMAT_PDF
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions.SCANNER_MODE_FULL
import com.google.mlkit.vision.documentscanner.GmsDocumentScanning
import com.google.mlkit.vision.documentscanner.GmsDocumentScanningResult
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File

class MymoduleModule : Module() {

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
        Name("Mymodule")

        Constants(
            "PI" to Math.PI
        )

        Events("onChange")

        Function("hello") {
            "Hello world! 👋"
        }

        AsyncFunction("setValueAsync") { value: String ->
            sendEvent("onChange", mapOf(
                "value" to value
            ))
        }

        View(MymoduleView::class) {
            Prop("name") { view: MymoduleView, prop: String ->
                println(prop)
            }
        }

        AsyncFunction("scan") {
            scanner.getStartScanIntent(activity)
                .addOnSuccessListener { intentSender ->
                    activity.startIntentSenderForResult(
                        intentSender,
                        REQUEST_CODE,
                        null,
                        0,
                        0,
                        0,
                        null
                    )
                }
                .addOnFailureListener {
                    Toast.makeText(context, "${it.message}", Toast.LENGTH_LONG).show()
                }
        }

        OnActivityResult { activity, onActivityResultPayload ->
            if (onActivityResultPayload.requestCode == REQUEST_CODE && onActivityResultPayload.resultCode == RESULT_OK) {
                val docResult = GmsDocumentScanningResult.fromActivityResultIntent(onActivityResultPayload.data)

                // Iterate through document pages (commented out for now)
                /*
                docResult?.pages?.let { pages ->
                    for (page in pages) {
                        // Your code to handle each page
                    }
                }
                */

                docResult?.pdf?.let { pdf ->
                    val pdfUri = pdf.uri.path
                    val pageCount = pdf.pageCount
                    val externalUri = pdf.uri.path?.let { File(it) }?.let {
                        FileProvider.getUriForFile(
                            activity,
                            "${activity.packageName}.provider", it
                        )
                    }
                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                        putExtra(Intent.EXTRA_STREAM, externalUri)
                        type = "application/pdf"
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }
                    activity.startActivity(Intent.createChooser(shareIntent, "share pdf"))
                }
            }
        }
    }
}
