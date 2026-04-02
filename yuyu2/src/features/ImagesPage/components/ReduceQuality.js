export async function ReduceQuality(
  imageSrc,
  maxHeight,
  maxWidth,
  quality = 1,
) {
  return new Promise((resolve, reject) => {
    // Timeout para evitar promesas colgadas
    const timeoutId = setTimeout(() => {
      reject(new Error("Timeout loading the image"));
    }, 10000); // 30 segundos máximo

    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      let blobUrl = null; // Save the url

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("Error al cargar la imagen"));
      };

      img.onload = function () {
        clearTimeout(timeoutId);

        const widthOriginal = img.naturalWidth;
        const heightOriginal = img.naturalHeight;

        // If reducing the quality is not needed
        if (widthOriginal <= maxWidth && heightOriginal <= maxHeight) {
          resolve({
            reduced: imageSrc,
            width: widthOriginal,
            height: heightOriginal,
            changed: false,
          });
          return;
        }

        // Calculate new dimensions
        let newWidth, newHeigth;

        const ratioOriginal = widthOriginal / heightOriginal;
        const ratioMax = maxWidth / maxHeight;

        if (ratioOriginal > ratioMax) {
          // If is more wide
          newWidth = maxWidth;
          newHeigth = maxWidth / ratioOriginal;
        } else {
          // If has more heigth
          newHeigth = maxHeight;
          newWidth = maxHeight * ratioOriginal;
        }

        newWidth = Math.round(newWidth);
        newHeigth = Math.round(newHeigth);

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeigth;

        const ctx = canvas.getContext("2d");

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, 0, 0, newWidth, newHeigth);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Error creating blob"));
              return;
            }

            blobUrl = URL.createObjectURL(blob);

            canvas.remove();

            resolve({
              reduced: blobUrl,
              width: newWidth,
              height: newHeigth,
              changed: true,
            });
          },
          "image/jpeg",
          quality,
        );
      };

      img.src = imageSrc;
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}
