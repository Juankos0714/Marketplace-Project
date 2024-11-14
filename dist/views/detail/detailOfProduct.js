"use strict";
window.onload = () => {
    const imgElement = document.getElementById('div_product-image');
    if (imgElement) {
        // Verificar si la imagen ya está cargada
        if (imgElement.complete) {
            handleImageLoad();
        }
        else {
            imgElement.onload = handleImageLoad;
        }
    }
    function handleImageLoad() {
        const backgroundDiv = document.getElementById('blurred-background');
        if (backgroundDiv) {
            backgroundDiv.style.backgroundImage = `url(${imgElement.src})`;
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let vibrantColor = { r: 0, g: 0, b: 0 };
            let maxSaturation = 0;
            for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const [h, s, l] = rgbToHsl(r, g, b);
                if (s > 0.5 && l > 0.2 && l < 0.8) {
                    if (s > maxSaturation) {
                        maxSaturation = s;
                        vibrantColor = { r, g, b };
                    }
                }
            }
            const vibrantRgb = `rgb(${vibrantColor.r}, ${vibrantColor.g}, ${vibrantColor.b})`;
            const h1 = document.querySelector('h1');
            const button = document.querySelector('button');
            if (h1)
                h1.style.color = vibrantRgb;
            if (button) {
                button.style.backgroundColor = vibrantRgb;
                button.style.borderColor = vibrantRgb;
            }
        }
    }
    // Manejo de errores en caso de que la imagen no se cargue
    imgElement.onerror = () => {
        console.error('Error al cargar la imagen.');
        // Puedes agregar un manejo adicional, como mostrar una imagen de error
    };
};
// Helper function to convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}
