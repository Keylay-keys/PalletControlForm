// TextElement.kt
package expo.modules.ocr.models

data class TextElement(
    val text: String,
    val x: Float,
    val y: Float,
    val width: Float,
    val charCount: Int,
    var inLineItemBounds: Boolean = false,
    var assigned: Boolean = false,
    var topNeighbor: TextElement? = null,
    var bottomNeighbor: TextElement? = null,
    var leftNeighbor: TextElement? = null,
    var rightNeighbor: TextElement? = null
)
