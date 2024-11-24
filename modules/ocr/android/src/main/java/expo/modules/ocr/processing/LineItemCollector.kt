package expo.modules.ocr.processing

import android.util.Log
import com.google.mlkit.vision.text.Text
import expo.modules.ocr.models.TextElement
import kotlin.math.abs

class LineItemCollector(private val tag: String) {

    private val validationRules = ValidationRules(tag)

    enum class NeighborDirection {
        TOP, BOTTOM, LEFT, RIGHT
    }

    private fun validateDateFormat(date: String): Boolean {
        return date.matches(Regex("\\d{2}/\\d{2}/\\d{4}"))
    }


    
private fun preprocessDate(date: String): String {
        // First handle any OCR mistakes in the digits and separators
        val cleanedDate = date.replace("O", "0")
                             .replace("o", "0")
                             .replace("I", "1")
                             .replace("i", "1")
                             .replace("l", "1")
                             .replace("r", "/")  // Handle 'r' as separator
                             .replace("R", "/")  // Handle 'R' as separator
                             .replace("\\", "/") // Handle backslash as separator
                             .replace("-", "/")  // Normalize other separators
                             .replace(".", "/")  // Normalize other separators
        
        val parts = cleanedDate.split("/")
        if (parts.size == 3) {
            val month = parts[0].padStart(2, '0') // Ensure month is two digits
            val day = parts[1].padStart(2, '0')   // Ensure day is two digits
            val year = parts[2]                   // Year stays unchanged
            
            // Additional validation for reasonable date values
            try {
                val monthInt = month.toInt()
                val dayInt = day.toInt()
                val yearInt = year.toInt()
                
                // Basic range checks
                if (monthInt !in 1..12 || dayInt < 1 || yearInt < 1900 || yearInt > 2100) {
                    Log.w(tag, "Invalid date values: month=$monthInt, day=$dayInt, year=$yearInt")
                    return date
                }
                
                // Check days in month
                val daysInMonth = when (monthInt) {
                    2 -> if (yearInt % 4 == 0 && (yearInt % 100 != 0 || yearInt % 400 == 0)) 29 else 28
                    4, 6, 9, 11 -> 30
                    else -> 31
                }
                
                if (dayInt > daysInMonth) {
                    Log.w(tag, "Invalid day for month: $dayInt > $daysInMonth for month $monthInt")
                    return date
                }
            } catch (e: NumberFormatException) {
                Log.w(tag, "Error parsing date numbers: $date", e)
                return date
            }
            
            val correctedDate = "$month/$day/$year"
            if (correctedDate != date) {
                Log.d(tag, "Corrected date format: $date -> $correctedDate")
            }
            return correctedDate
        }
        Log.d(tag, "Preprocessing failed - invalid date format: $date")
        return date // Return the original if preprocessing fails
    }


    fun collectLineItems(visionText: Text, headerY: Float, footerY: Float): MutableList<TextElement> {
        Log.d(tag, "=== Starting Collection Process ===")
        
        // Step 1: Collect all elements
        val allElements = collectInitialElements(visionText, headerY, footerY)
        Log.d(tag, "Step 1: Collected ${allElements.size} initial elements")

        // Step 2: Flag joined elements
        val flaggedElements = allElements.filter { element ->
            val matches = element.inLineItemBounds && // Only consider in-bounds elements
                (element.text.matches(Regex("[A-Z0-9]{8,}\\s+[0-9OIl]{1,2}[/\\\\rR.-][0-9OIl]{2}[/\\\\rR.-][0-9]{4}\\s+\\d{1,2}\\*?")) || 
                element.text.matches(Regex("[A-Z0-9]{8,}\\s+[0-9OIl]{1,2}[/\\\\rR.-][0-9OIl]{2}[/\\\\rR.-][0-9]{4}")) ||
                element.text.contains(Regex("([A-Z0-9]{8,}).*?([0-9OIl]{1,2}[/\\\\rR.-][0-9OIl]{2}[/\\\\rR.-][0-9]{4})")))
            Log.d(tag, "Checking element: '${element.text}' - inBounds: ${element.inLineItemBounds}, matches: $matches")
            matches
        }
        Log.d(tag, "Step 2: Flagged ${flaggedElements.size} joined elements")

        // Step 3: Separate flagged elements
        val separatedElements = mutableListOf<TextElement>()
        flaggedElements.forEach { element ->
            val separated = splitMultiFieldElement(element)
            separatedElements.addAll(separated)
            Log.d(tag, "Split '${element.text}' into ${separated.size} elements")
        }
        Log.d(tag, "Step 3: Created ${separatedElements.size} separated elements")

        // Step 4: Create a list of non-flagged elements
        val nonFlaggedElements = allElements.filterNot { flaggedElements.contains(it) }
        Log.d(tag, "Step 4: Found ${nonFlaggedElements.size} non-flagged elements")

        // Step 5: Combine non-flagged elements with separated components
        val finalElements = nonFlaggedElements + separatedElements
        Log.d(tag, "Step 5: Combined into ${finalElements.size} total elements")

        // Step 6: Get in-bounds elements
        val inBoundsElements = finalElements.filter { it.inLineItemBounds }
        Log.d(tag, "Step 6: Found ${inBoundsElements.size} in-bounds elements")

        // Step 7: Assign neighbors
        Log.d(tag, "Step 7: Starting neighbor assignment")
        assignNeighbors(inBoundsElements.toMutableList())
        Log.d(tag, "Step 7: Completed neighbor assignment")

        Log.d(tag, "=== Collection Process Complete ===")
        return inBoundsElements.toMutableList()
    }


    private fun collectInitialElements(visionText: Text, headerY: Float, footerY: Float): MutableList<TextElement> {
        val initialElements = mutableListOf<TextElement>()

        for (block in visionText.textBlocks) {
            for (line in block.lines) {
                val boundingBox = line.boundingBox ?: continue
                val y = boundingBox.centerY().toFloat()

                val element = TextElement(
                    text = line.text.trim(),
                    x = boundingBox.left.toFloat(),
                    y = y,
                    width = boundingBox.width().toFloat(),
                    charCount = line.text.length,
                    inLineItemBounds = y > headerY && y < footerY,
                    assigned = false
                )

                initialElements.add(element)
                Log.d(tag, "Collected initial element: ${element.text} at position (${element.x}, ${element.y}), inBounds: ${element.inLineItemBounds}")
            }
        }
        return initialElements
    }

    private fun separateCombinedElements(initialElements: MutableList<TextElement>): MutableList<TextElement> {
        val separatedElements = mutableListOf<TextElement>()

        initialElements.forEach { element ->
            if (!element.inLineItemBounds) {
                // Add out-of-bounds elements without changes
                separatedElements.add(element)
                return@forEach
            }

            // Check for combined patterns and split them
            when {
                // Match batch+date+days pattern
                element.text.matches(Regex("[A-Z0-9]{8,}\\s+\\d{2}/\\d{2}/\\d{4}\\s+\\d{1,2}\\*?")) -> {
                    separatedElements.addAll(splitMultiFieldElement(element)) // Add split components
                }
                // Match batch+date pattern
                element.text.matches(Regex("[A-Z0-9]{8,}\\s+\\d{2}/\\d{2}/\\d{4}")) -> {
                    separatedElements.addAll(splitMultiFieldElement(element)) // Add split components
                }
                // Match any other combined patterns
                element.text.contains(Regex("([A-Z0-9]{8,}).*?(\\d{2}/\\d{2}/\\d{4})")) -> {
                    separatedElements.addAll(splitMultiFieldElement(element)) // Add split components
                }
                else -> {
                    // Add the original element if it doesn't match any pattern
                    separatedElements.add(element)
                }
            }

            Log.d(tag, "Processed element: ${element.text}")
        }

        return separatedElements
    }


    private fun splitMultiFieldElement(element: TextElement): List<TextElement> {
        val separatedElements = mutableListOf<TextElement>()

        Log.d(tag, "=== Processing Element ===")
        Log.d(tag, "Text: '${element.text}' | Position: (${element.x}, ${element.y}) | Width: ${element.width}")

        when {
            // Batch + Date + Days - more lenient pattern matching
            element.text.matches(Regex("[A-Z0-9]{8,}\\s+[0-9OIl]{1,2}[/.-][0-9OIl]{2}[/.-][0-9]{4}\\s+\\d{1,2}\\*?")) -> {
                Log.d(tag, "Pattern Matched: Batch + Date + Days")
                val parts = element.text.split("\\s+".toRegex()).toMutableList()
                Log.d(tag, "Split Parts: ${parts.joinToString(", ")}")

                // Validate split
                if (parts.size != 3) {
                    Log.e(tag, "Error: Expected 3 parts but got ${parts.size}. Skipping element.")
                    return separatedElements
                }

                // Validate Batch
                if (parts[0].length != 10) {
                    Log.e(tag, "Error: Invalid Batch Length | Value: '${parts[0]}' | Length: ${parts[0].length}")
                    return separatedElements
                }

                // Preprocess Date - handle OCR mistakes
                val cleanedDate = preprocessDate(parts[1])
                if (!validateDateFormat(cleanedDate)) {
                    Log.e(tag, "Error: Date Recovery Failed | Original: '${parts[1]}' | Attempted Fix: '$cleanedDate'")
                    return separatedElements
                }
                parts[1] = cleanedDate
                Log.d(tag, "Date Fixed: '$cleanedDate'")

                // Validate Date
                if (!validateDateFormat(parts[1])) {
                    val attemptedFix = preprocessDate(parts[1])
                    Log.w(tag, "Invalid Date Format | Original: '${parts[1]}' | Attempted Fix: '$attemptedFix'")
                    if (!validateDateFormat(attemptedFix)) {
                        Log.e(tag, "Error: Date Recovery Failed | Value: '$attemptedFix'")
                        return separatedElements
                    }
                    parts[1] = attemptedFix
                    Log.d(tag, "Date Fixed: '$attemptedFix'")
                }

                // Validate Date
                if (!validateDateFormat(parts[1])) {
                    val attemptedFix = preprocessDate(parts[1])
                    Log.w(tag, "Invalid Date Format | Original: '${parts[1]}' | Attempted Fix: '$attemptedFix'")
                    if (!validateDateFormat(attemptedFix)) {
                        Log.e(tag, "Error: Date Recovery Failed | Value: '$attemptedFix'")
                        return separatedElements
                    }
                    parts[1] = attemptedFix
                    Log.d(tag, "Date Fixed: '$attemptedFix'")
                }

                // Updated Days validation to handle asterisk
                // Remove asterisk for length check, then verify the numeric part
                val daysWithoutAsterisk = parts[2].replace("*", "")
                if (daysWithoutAsterisk.length > 2 || !daysWithoutAsterisk.matches(Regex("\\d{1,2}"))) {
                    Log.e(tag, "Error: Invalid Days Format | Value: '${parts[2]}' | Numeric Part: $daysWithoutAsterisk")
                    return separatedElements
                }

                // Calculate xStep for splitting
                val xStep = element.width / 3

                // Add split elements
                separatedElements.addAll(
                    listOf(
                        TextElement(
                            text = parts[0],
                            x = element.x,
                            y = element.y,
                            width = xStep,
                            charCount = parts[0].length,
                            inLineItemBounds = element.inLineItemBounds,
                            assigned = false
                        ),
                        TextElement(
                            text = parts[1],
                            x = element.x + xStep,
                            y = element.y,
                            width = xStep,
                            charCount = parts[1].length,
                            inLineItemBounds = element.inLineItemBounds,
                            assigned = false
                        ),
                        TextElement(
                            text = parts[2],  // Keep the asterisk in the final output
                            x = element.x + (2 * xStep),
                            y = element.y,
                            width = xStep,
                            charCount = parts[2].length,
                            inLineItemBounds = element.inLineItemBounds,
                            assigned = false
                        )
                    )
                )

                Log.d(tag, "Split Successful: Batch='${parts[0]}', Date='${parts[1]}', Days='${parts[2]}'")
            }

            // Batch + Date
            element.text.matches(Regex("[A-Z0-9]{8,}\\s+\\d{1,2}/\\d{2}/\\d{4}")) -> {
                Log.d(tag, "Pattern Matched: Batch + Date")
                val parts = element.text.split("\\s+".toRegex()).toMutableList()
                Log.d(tag, "Split Parts: ${parts.joinToString(", ")}")

                if (parts.size != 2) {
                    Log.e(tag, "Error: Expected 2 parts but got ${parts.size}. Skipping element.")
                    return separatedElements
                }

                // Similar validation for batch and date
                // Batch
                if (parts[0].length != 10) {
                    Log.e(tag, "Error: Invalid Batch Length | Value: '${parts[0]}' | Length: ${parts[0].length}")
                    return separatedElements
                }

                // Date
                if (!validateDateFormat(parts[1])) {
                    val attemptedFix = preprocessDate(parts[1])
                    Log.w(tag, "Invalid Date Format | Original: '${parts[1]}' | Attempted Fix: '$attemptedFix'")
                    if (!validateDateFormat(attemptedFix)) {
                        Log.e(tag, "Error: Date Recovery Failed | Value: '$attemptedFix'")
                        return separatedElements
                    }
                    parts[1] = attemptedFix
                    Log.d(tag, "Date Fixed: '$attemptedFix'")
                }

                val xStep = element.width / 2

                separatedElements.addAll(
                    listOf(
                        TextElement(
                            text = parts[0],
                            x = element.x,
                            y = element.y,
                            width = xStep,
                            charCount = parts[0].length,
                            inLineItemBounds = element.inLineItemBounds,
                            assigned = false
                        ),
                        TextElement(
                            text = parts[1],
                            x = element.x + xStep,
                            y = element.y,
                            width = xStep,
                            charCount = parts[1].length,
                            inLineItemBounds = element.inLineItemBounds,
                            assigned = false
                        )
                    )
                )

                Log.d(tag, "Split Successful: Batch='${parts[0]}', Date='${parts[1]}'")
            }

            // No Pattern Match
            else -> {
                Log.d(tag, "No Pattern Match Found. Adding original element as is.")
                separatedElements.add(element)
            }
        }

        Log.d(tag, "=== Processing Complete ===")
        return separatedElements
    }



    private fun calculateLineSpacing(elements: List<TextElement>): Float {
        val products = elements.filter { 
            it.inLineItemBounds && 
            it.text.matches(Regex("^\\d{4,5}$")) 
        }.sortedBy { it.y }

        val spacings = mutableListOf<Float>()
        for (i in 0 until products.size - 1) {
            val spacing = products[i + 1].y - products[i].y
            if (spacing < 100f) { // Ignore big jumps
                spacings.add(spacing)
                Log.d(tag, "Line spacing between ${products[i].text} and ${products[i+1].text}: $spacing")
            }
        }
        
        val averageSpacing = spacings.average().toFloat()
        Log.d(tag, "Average line spacing: $averageSpacing")
        return averageSpacing
    }

    // When checking elements
        private fun processElement(element: TextElement, headerY: Float, footerY: Float) {
        // First check for suspicious lowercase
        if (validationRules.detectSuspiciousLowercase(element)) {
            Log.d(tag, "Found suspicious lowercase in element: ${element.text}")
        }

        // Then validate neighbors
        val validationResult = validationRules.validateNeighbors(element, headerY, footerY)
        if (!validationResult.isValid) {
            Log.d(tag, """
                Validation Failed for: ${element.text}
                Issue: ${validationResult.issue}
                Suggested Fix: ${validationResult.suggestedFix}
            """.trimIndent())
            // Add recovery logic if needed
        }
    }

    private fun assignNeighbors(elements: MutableList<TextElement>) {
        // Calculate line spacing once
        val lineSpacing = calculateLineSpacing(elements)
        Log.d(tag, "Using line spacing: $lineSpacing")
        
        
        
        // Only process elements within bounds
        val inBoundsElements = elements.filter { it.inLineItemBounds }
        
        
        inBoundsElements.forEach { current ->
            Log.d(tag, """
                ==== Finding neighbors for element: ${current.text} ====
                Position: (${current.x}, ${current.y})
                Width: ${current.width}
                In Bounds: ${current.inLineItemBounds}
                Assigned: ${current.assigned}
            """.trimIndent())
                
            current.topNeighbor = findClosestNeighbor(current, inBoundsElements, NeighborDirection.TOP, lineSpacing)
            current.bottomNeighbor = findClosestNeighbor(current, inBoundsElements, NeighborDirection.BOTTOM, lineSpacing)
            current.leftNeighbor = findClosestNeighbor(current, inBoundsElements, NeighborDirection.LEFT, lineSpacing)
            current.rightNeighbor = findClosestNeighbor(current, inBoundsElements, NeighborDirection.RIGHT, lineSpacing)
                
            Log.d(tag, """
                Found neighbors for '${current.text}':
                RIGHT: ${current.rightNeighbor?.let { "Found '${it.text}' at (${it.x}, ${it.y})" } ?: "none"}
                LEFT: ${current.leftNeighbor?.let { "Found '${it.text}' at (${it.x}, ${it.y})" } ?: "none"}
                TOP: ${current.topNeighbor?.let { "Found '${it.text}' at (${it.x}, ${it.y})" } ?: "none"}
                BOTTOM: ${current.bottomNeighbor?.let { "Found '${it.text}' at (${it.x}, ${it.y})" } ?: "none"}
                ===============================================
            """.trimIndent())
        }
    }

    private fun findClosestNeighbor(
        current: TextElement, 
        elements: List<TextElement>, 
        direction: NeighborDirection,
        lineSpacing: Float
    ): TextElement? {
        var closestNeighbor: TextElement? = null
        var minDistance = Float.MAX_VALUE

        elements.forEach { candidate ->
            // Only consider elements that are:
            // 1. Not the current element
            // 2. In line item bounds
            // 3. Not already assigned
            // 4. Within reasonable X or Y coordinate range
            if (candidate != current && 
                candidate.inLineItemBounds && 
                !candidate.assigned) {

                // Calculate the distance based on the direction
                val distance = when (direction) {
                    NeighborDirection.RIGHT -> if (candidate.x > current.x &&
                                                abs(candidate.y - current.y) < lineSpacing / 2) {
                        calculateDistance(current, candidate)
                    } else Float.MAX_VALUE

                    NeighborDirection.LEFT -> if (candidate.x < current.x &&
                                                abs(candidate.y - current.y) < lineSpacing / 2) {
                        calculateDistance(current, candidate)
                    } else Float.MAX_VALUE

                    NeighborDirection.TOP -> if (candidate.y < current.y &&
                                                abs(candidate.x - current.x) < 10f) {
                        val yDistance = current.y - candidate.y
                        if (yDistance < lineSpacing * 1.5) {
                            calculateDistance(current, candidate)
                        } else Float.MAX_VALUE
                    } else Float.MAX_VALUE

                    NeighborDirection.BOTTOM -> if (candidate.y > current.y &&
                                                    abs(candidate.x - current.x) < 10f) {
                        val yDistance = candidate.y - current.y
                        if (yDistance < lineSpacing * 1.5) {
                            calculateDistance(current, candidate)
                        } else Float.MAX_VALUE
                    } else Float.MAX_VALUE
                }

                // Update closest neighbor if this candidate is closer
                if (distance < minDistance) {
                    minDistance = distance
                    closestNeighbor = candidate
                    Log.d(tag, "New closest ${direction.name} neighbor for '${current.text}': '${candidate.text}' at distance $distance")
                }
            }
        }

        return closestNeighbor
    }


    private fun calculateDistance(a: TextElement, b: TextElement): Float {
        val dx = b.x - a.x
        val dy = b.y - a.y
        return kotlin.math.sqrt(dx * dx + dy * dy)
    }
}