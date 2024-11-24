package expo.modules.ocr.models

data class ProcessedItem(
    val product: String,
    val description: String,
    val batch: String?,
    val bestBefore: String?,
    val days: String?,
    val y: Float
)