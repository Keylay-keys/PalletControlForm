// processing/ValidationRules.kt
package expo.modules.ocr.processing

import android.util.Log
import expo.modules.ocr.models.TextElement
import kotlin.math.abs

data class ValidationResult(
    val isValid: Boolean,
    val issue: String? = null,
    val suggestedFix: String? = null
)

class ValidationRules(private val tag: String) {
    companion object {
        private val VALID_LOWERCASE_WORDS = setOf("Tray", "Tote")
        
        // Date validation constants
        private const val MIN_YEAR = 2020
        private const val MAX_YEAR = 2030

        private const val DATE_REGEX = "\\d{1,2}/\\d{1,2}/\\d{4}"
        private val DATE_OCR_SUBSTITUTIONS = mapOf(
            "O" to "0",
            "o" to "0",
            "I" to "1",
            "i" to "1",
            "l" to "1",
            "r" to "/",
            "R" to "/",
            ":" to "/",
            "\\" to "/",
            "-" to "/",
            "." to "/"
        )
    } 

    fun preprocessDate(date: String): String? {
        // Apply substitutions for OCR corrections
        val cleanedDate = DATE_OCR_SUBSTITUTIONS.entries.fold(date) { result, (key, value) ->
            result.replace(key, value)
        }

        val parts = cleanedDate.split("/")
        if (parts.size != 3) return null  // Return null for invalid format

        try {
            val month = parts[0].padStart(2, '0')
            val day = parts[1].padStart(2, '0')
            val year = parts[2]

            val monthInt = month.toInt()
            val dayInt = day.toInt()
            val yearInt = year.toInt()

            // Basic range checks
            if (monthInt !in 1..12 || dayInt < 1 || yearInt < MIN_YEAR || yearInt > MAX_YEAR) {
                Log.w(tag, "Invalid date values: month=$monthInt, day=$dayInt, year=$yearInt")
                return null
            }

            // Check days in month
            val daysInMonth = when (monthInt) {
                2 -> if (yearInt % 4 == 0 && (yearInt % 100 != 0 || yearInt % 400 == 0)) 29 else 28
                4, 6, 9, 11 -> 30
                else -> 31
            }

            if (dayInt > daysInMonth) {
                Log.w(tag, "Invalid day for month: $dayInt > $daysInMonth for month $monthInt")
                return null
            }

            return "$month/$day/$year"

        } catch (e: NumberFormatException) {
            Log.w(tag, "Error parsing date numbers: $date", e)
            return null
        }
    }

    fun detectSuspiciousLowercase(element: TextElement): Boolean {
            if (element.text in VALID_LOWERCASE_WORDS) {
                return false
            }

            val hasLowercase = element.text.contains(Regex("[a-z]"))
            if (hasLowercase) {
                when {
                    element.text.matches(Regex("^\\d{4,5}$")) -> {
                        Log.d(tag, "Suspicious: Product number contains lowercase: ${element.text}")
                        return true
                    }
                    element.text.matches(Regex("[A-Z0-9]{8,}")) -> {
                        Log.d(tag, "Suspicious: Batch number contains lowercase: ${element.text}")
                        return true
                    }
                    element.text.matches(Regex("\\d{1,2}/\\d{1,2}/\\d{4}")) -> {
                        Log.d(tag, "Suspicious: Date contains lowercase: ${element.text}")
                        return true
                    }
                    element.text.matches(Regex("\\d{1,2}\\*?")) -> {
                        Log.d(tag, "Suspicious: Days contains lowercase: ${element.text}")
                        return true
                    }
                }
            }
            return false
        }

    
    fun validateNeighbors(element: TextElement, headerY: Float, footerY: Float): ValidationResult {
        // Fixed unnecessary safe call and Elvis operator
        val processedElement = if (element.text.matches(Regex("[0-9OIl]{1,2}[/\\\\rR.-][0-9OIl]{1,2}[/\\\\rR.-][0-9]{4}"))) {
            preprocessDate(element.text)?.let { processedDate ->
                element.copy(text = processedDate)
            } ?: element  // This is fine since element is non-null
        } else {
            element
        }
        
        return when {
            // Product number validation
            processedElement.text.matches(Regex(DATE_REGEX)) -> 
                validateProductNeighbors(processedElement, headerY, footerY)

            // Description validation
            processedElement.text.matches(Regex("^[A-Z ]+$")) -> 
                validateDescriptionNeighbors(processedElement)

            // Batch validation
            processedElement.text.matches(Regex("[A-Z0-9]{8,}")) -> 
                validateBatchNeighbors(processedElement)

            // Best Before Date validation - now with more lenient initial matching
            processedElement.text.matches(Regex("\\d{2}/\\d{2}/\\d{4}")) -> 
                validateDateNeighbors(processedElement)

            // Days validation
            processedElement.text.matches(Regex("\\d{1,2}\\*?")) -> 
                validateDaysNeighbors(processedElement)

            else -> ValidationResult(
                isValid = false,
                issue = "Unknown element type: ${processedElement.text}",
                suggestedFix = "Ensure proper formatting and alignment"
            )
        }
    }

    private fun validateProductNeighbors(element: TextElement, headerY: Float, footerY: Float): ValidationResult {
        // Check Left - should have no neighbor
        if (element.leftNeighbor != null) {
            return ValidationResult(
                isValid = false,
                issue = "Product number should not have left neighbor",
                suggestedFix = "Check if element is misclassified"
            )
        }

        // Check Right - must be Description (not a product, not a batch)
        element.rightNeighbor?.let { right ->
            if (right.text.matches(Regex("^\\d{4,5}$")) || 
                right.text.matches(Regex("[A-Z0-9]{8,}"))) {
                return ValidationResult(
                    isValid = false,
                    issue = "Product number's right neighbor should be Description",
                    suggestedFix = "Check column alignment"
                )
            }
        }

        // Check Top - must be another product or close to header
        if (element.topNeighbor == null && abs(element.y - headerY) > 100f) {
            return ValidationResult(
                isValid = false,
                issue = "Product missing valid top neighbor",
                suggestedFix = "Verify if first product in list"
            )
        }

        // Check Bottom - must be another product or close to footer
        if (element.bottomNeighbor == null && abs(element.y - footerY) > 100f) {
            return ValidationResult(
                isValid = false,
                issue = "Product missing valid bottom neighbor",
                suggestedFix = "Verify if last product in list"
            )
        }

        return ValidationResult(isValid = true)
    }

    private fun validateDescriptionNeighbors(element: TextElement): ValidationResult {
        // Check Left - must be a Product
        element.leftNeighbor?.let { left ->
            if (!left.text.matches(Regex("^\\d{4,5}$"))) {
                return ValidationResult(
                    isValid = false,
                    issue = "Description's left neighbor must be a Product",
                    suggestedFix = "Ensure proper alignment of Description with a Product number"
                )
            }
        }

        // Check Right - must be a Batch
        element.rightNeighbor?.let { right ->
            if (!right.text.matches(Regex("[A-Z0-9]{8,}"))) {
                return ValidationResult(
                    isValid = false,
                    issue = "Description's right neighbor must be a Batch",
                    suggestedFix = "Ensure proper alignment of Description with a Batch"
                )
            }
        }

        return ValidationResult(isValid = true)
    }

    // Fixed unused parameter warnings by implementing the methods
    private fun validateBatchNeighbors(element: TextElement): ValidationResult {
        // Batch should have description to its left and date to its right
        element.leftNeighbor?.let { left ->
            if (!left.text.matches(Regex("^[A-Z ]+$"))) {
                return ValidationResult(
                    isValid = false,
                    issue = "Batch's left neighbor must be a Description",
                    suggestedFix = "Check batch alignment with description"
                )
            }
        }

        element.rightNeighbor?.let { right ->
            if (!right.text.matches(Regex("\\d{2}/\\d{2}/\\d{4}"))) {
                return ValidationResult(
                    isValid = false,
                    issue = "Batch's right neighbor must be a Date",
                    suggestedFix = "Check batch alignment with date"
                )
            }
        }

        return ValidationResult(isValid = true)
    }

    private fun validateDateNeighbors(element: TextElement): ValidationResult {
        // Date must have a batch to its left
        element.leftNeighbor?.let { left ->
            if (!left.text.matches(Regex("[A-Z0-9]{8,}"))) {
                return ValidationResult(
                    isValid = false,
                    issue = "Date's left neighbor must be a Batch",
                    suggestedFix = "Check date alignment with batch number"
                )
            }
        } ?: return ValidationResult(
            isValid = false,
            issue = "Date missing left batch neighbor",
            suggestedFix = "Verify date is properly aligned with a batch number"
        )

        // Date can optionally have days to its right
        element.rightNeighbor?.let { right ->
            if (!right.text.matches(Regex("\\d{1,2}\\*?"))) {
                return ValidationResult(
                    isValid = false,
                    issue = "Date's right neighbor must be Days if present",
                    suggestedFix = "Check alignment of date and days"
                )
            }
        }

        return ValidationResult(isValid = true)
    }

    private fun validateDaysNeighbors(element: TextElement): ValidationResult {
        // Days should have date to its left and no right neighbor
        element.leftNeighbor?.let { left ->
            if (!left.text.matches(Regex("\\d{2}/\\d{2}/\\d{4}"))) {
                return ValidationResult(
                    isValid = false,
                    issue = "Days's left neighbor must be a Date",
                    suggestedFix = "Check days alignment with date"
                )
            }
        }

        if (element.rightNeighbor != null) {
            return ValidationResult(
                isValid = false,
                issue = "Days should not have a right neighbor",
                suggestedFix = "Check if days element is properly aligned"
            )
        }

        return ValidationResult(isValid = true)
    }
}
