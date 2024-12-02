window.onload = function () {
    var imgElement = document.getElementById('div_product-image');
    if (imgElement) {
        if (imgElement.complete) {
            handleImageLoad();
        }
        else {
            imgElement.onload = handleImageLoad;
        }
    }
    else {
        console.error('El elemento de imagen no se encontró.');
    }
    function handleImageLoad() {
        var backgroundDiv = document.getElementById('blurred-background');
        if (backgroundDiv) {
            backgroundDiv.style.backgroundImage = "url(".concat(imgElement.src, ")");
        }
        else {
            console.error('El elemento de fondo no se encontró.');
        }
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;
            var vibrantColor_1 = { r: 0, g: 0, b: 0 };
            var maxSaturation = 0;
            for (var i = 0; i < pixels.length; i += 4) {
                var r = pixels[i];
                var g = pixels[i + 1];
                var b = pixels[i + 2];
                var saturation = Math.max(r, g, b) - Math.min(r, g, b);
                if (saturation > maxSaturation) {
                    maxSaturation = saturation;
                    vibrantColor_1 = { r: r, g: g, b: b };
                }
            }
            // Guarda el color vibrante en una variable CSS
            var vibrantRgb = "rgb(".concat(vibrantColor_1.r, ", ").concat(vibrantColor_1.g, ", ").concat(vibrantColor_1.b, ")");
            document.documentElement.style.setProperty('--vibrant-color', vibrantRgb);
            // Aplica estilos a los elementos usando la variable CSS
            var h2Elements = document.querySelectorAll('h2'); // Corregido para seleccionar ambos
            h2Elements.forEach(function (h2) {
                h2.style.color = 'var(--vibrant-color)'; // Usando la variable CSS
            });
            var buttonElements = document.querySelectorAll('a#buy-button');
            buttonElements.forEach(function (element) {
                var a = element; // llamando a la variable a como HTMLAnchorElement
                a.style.backgroundColor = 'var(--vibrant-color)'; // Usando la variable CSS
                a.style.borderColor = 'var(--vibrant-color)'; // Usando la variable CSS
                function calculateBrightness(color) {
                    return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
                }
                function updateButtonTextColor() {
                    var brightness = calculateBrightness(vibrantColor_1);
                    a.style.color = brightness > 186 ? 'black' : 'white'; // Cambia el color del texto
                }
                updateButtonTextColor(); // Establecer color de texto inicial
                a.addEventListener('mouseover', function () {
                    a.style.boxShadow = "0 0 30px 5px rgba(".concat(vibrantColor_1.r, ", ").concat(vibrantColor_1.g, ", ").concat(vibrantColor_1.b, ", 0.815)"); // Cambia el color de la sombra al hacer hover
                    updateButtonTextColor(); // Actualiza el color del texto al hacer hover
                });
                a.addEventListener('mouseout', function () {
                    a.style.boxShadow = '0 0 0 0 transparent';
                    updateButtonTextColor(); // Actualiza el color del texto al salir del hover
                });
            });
        }
    }
    imgElement.onerror = function () {
        console.error('Error al cargar la imagen.');
    };
};
