window.onload = function () {
    var imgElement = document.getElementById('div_product-image');
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
        var backgroundDiv = document.getElementById('blurred-background');
        if (backgroundDiv) {
            backgroundDiv.style.backgroundImage = "url(".concat(imgElement.src, ")");
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
                // Calcular el brillo y la saturación
                var brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                var saturation = Math.max(r, g, b) - Math.min(r, g, b);
                // Solo consideramos colores con buena saturación
                if (saturation > maxSaturation) {
                    maxSaturation = saturation;
                    vibrantColor_1 = { r: r, g: g, b: b };
                }
            }
            var vibrantRgb_1 = "rgb(".concat(vibrantColor_1.r, ", ").concat(vibrantColor_1.g, ", ").concat(vibrantColor_1.b, ")");
            var h2Elements = document.querySelectorAll('h2');
            // Cambiar el color solo de los elementos h2
            h2Elements.forEach(function (h2) {
                h2.style.color = vibrantRgb_1;
            });
            var button_1 = document.querySelector('button');
            if (button_1) {
                button_1.style.backgroundColor = vibrantRgb_1; // Cambia el color de fondo del botón
                button_1.style.borderColor = vibrantRgb_1; // Cambia el color del borde del botón
                // Función para calcular el brillo
                function calculateBrightness(color) {
                    return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
                }
                // Determinar el color del texto basado en el brillo
                function updateButtonTextColor() {
                    var brightness = calculateBrightness(vibrantColor_1);
                    button_1.style.color = brightness > 186 ? 'black' : 'white'; // Cambia el color del texto
                }
                updateButtonTextColor(); // Establecer color de texto inicial
                button_1.addEventListener('mouseover', function () {
                    button_1.style.boxShadow = "0 0 30px 5px rgba(".concat(vibrantColor_1.r, ", ").concat(vibrantColor_1.g, ", ").concat(vibrantColor_1.b, ", 0.815)"); // Cambia el color de la sombra al hacer hover
                    updateButtonTextColor(); // Actualiza el color del texto al hacer hover
                });
                button_1.addEventListener('mouseout', function () {
                    button_1.style.boxShadow = '0 0 0 0 transparent';
                    updateButtonTextColor(); // Actualiza el color del texto al salir del hover
                });
            }
        }
    }
    // Manejo de errores en caso de que la imagen no se cargue
    imgElement.onerror = function () {
        console.error('Error al cargar la imagen.');
        // Puedes agregar un manejo adicional, como mostrar una imagen de error
    };
};
// Bg Particles
var particleContainer = document.getElementById('particle-container');
var letters = ['A', 'X', 'Y', 'B', '◯', '△', '▢', '✖️'];
var colors = ['color-a', 'color-x', 'color-y', 'color-b', 'color-circle', 'color-triangle', 'color-cuadrado'];
// Función para crear una partícula
function createParticle() {
    var particle = document.createElement('div');
    var randomIndex = Math.floor(Math.random() * letters.length);
    particle.className = "particle ".concat(colors[randomIndex]); // Asignar clase de color
    particle.textContent = letters[randomIndex];
    // Establecer posición inicial en la parte inferior de la pantalla
    particle.style.left = "".concat(Math.random() * 100, "vw"); // Posición horizontal aleatoria
    particle.style.bottom = "0"; // Desde la parte inferior
    // Establecer opacidad
    particle.style.opacity = Math.random().toString();
    particleContainer.appendChild(particle);
    // Movimiento curvilíneo
    var duration = 8000; // Duración total de la animación
    var distance = Math.random() * 150 + 100; // Distancia aleatoria (entre 100 y 250px)
    var keyframes = [
        { transform: "translateY(0)", offset: 0 },
        { transform: "translate(-".concat(Math.random() * 50, "px, -").concat(distance, "px) rotate(").concat(Math.random() * 20 - 10, "deg)"), offset: 0.25 },
        { transform: "translate(-".concat(Math.random() * 50, "px, -").concat(distance + 50, "px) rotate(").concat(Math.random() * 20 - 10, "deg)"), offset: 0.5 },
        { transform: "translate(-".concat(Math.random() * 50, "px, -").concat(distance + 100, "px) rotate(").concat(Math.random() * 20 - 10, "deg)"), offset: 0.75 },
        { transform: "translate(-".concat(Math.random() * 50, "px, -").concat(distance + 150, "px)"), offset: 1 }
    ];
    // Aplicar la animación
    particle.animate(keyframes, {
        duration: duration,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
    // Desvanecer la partícula
    setTimeout(function () {
        particle.style.opacity = '0'; // Desvanecer
    }, duration - 1000); // Comenzar a desvanecer 1 segundo antes de que termine la animación
    // Eliminar la partícula después de la animación
    setTimeout(function () {
        particle.remove();
    }, duration); // Tiempo para que coincida con la duración de la animación
}
// Generar partículas a intervalos más cortos (cada 1000 ms)
setInterval(createParticle, 1000); // Generar cada 1000 ms para el doble de partículas
