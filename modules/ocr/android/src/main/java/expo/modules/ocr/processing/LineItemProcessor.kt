// LineItemProcessor.kt
package expo.modules.ocr.processing

import android.util.Log
import expo.modules.ocr.models.TextElement
import expo.modules.ocr.models.ProcessedItem

class LineItemProcessor(private val tag: String) {
    fun processLineItems(elements: List<TextElement>): List<ProcessedItem> {
        val processedItems = mutableListOf<ProcessedItem>()
        
        // Get all product numbers first
        val products = elements.filter { element ->
            element.inLineItemBounds &&
            !element.assigned &&
            element.text.matches(Regex("^\\d{4,5}$"))
        }.sortedBy { it.y }

        products.forEach { product ->
            product.assigned = true
            Log.d(tag, "Processing product: ${product.text}")

            // Use neighbor relationships to build line item
            val description = product.rightNeighbor
            val batch = description?.rightNeighbor
            val bestBefore = batch?.rightNeighbor
            val days = bestBefore?.rightNeighbor

            if (description != null) {
                description.assigned = true
                batch?.assigned = true
                bestBefore?.assigned = true
                days?.assigned = true

                processedItems.add(ProcessedItem(
                    product = product.text,
                    description = description.text,
                    batch = batch?.text,
                    bestBefore = bestBefore?.text,
                    days = days?.text,
                    y = product.y
                ))

                Log.d(tag, """
                    Created line item:
                    - Product: ${product.text}
                    - Description: ${description.text}
                    - Batch: ${batch?.text}
                    - Best Before: ${bestBefore?.text}
                    - Days: ${days?.text}
                """.trimIndent())
            }
        }

        return processedItems
    }
}