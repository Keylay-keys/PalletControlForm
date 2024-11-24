package expo.modules.ocr.preprocessing

import android.graphics.*

class ImageProcessor {
    fun convertToGrayscale(original: Bitmap): Bitmap {
        val grayscaleBitmap = Bitmap.createBitmap(original.width, original.height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(grayscaleBitmap)
        val paint = Paint()
        val colorMatrix = ColorMatrix()
        colorMatrix.setSaturation(0f)
        paint.colorFilter = ColorMatrixColorFilter(colorMatrix)
        canvas.drawBitmap(original, 0f, 0f, paint)
        return grayscaleBitmap
    }

    fun applyBinarization(bitmap: Bitmap): Bitmap {
        val pixels = IntArray(bitmap.width * bitmap.height)
        bitmap.getPixels(pixels, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)
        val threshold = 128

        for (i in pixels.indices) {
            val pixel = pixels[i]
            val gray = (Color.red(pixel) * 0.299 +
                    Color.green(pixel) * 0.587 +
                    Color.blue(pixel) * 0.114).toInt()
            pixels[i] = if (gray > threshold) Color.WHITE else Color.BLACK
        }

        val binarized = Bitmap.createBitmap(bitmap.width, bitmap.height, Bitmap.Config.ARGB_8888)
        binarized.setPixels(pixels, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)
        return binarized
    }
}