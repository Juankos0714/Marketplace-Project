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
                // Calcular el brillo y la saturación
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                const saturation = Math.max(r, g, b) - Math.min(r, g, b);
                // Solo consideramos colores con buena saturación
                if (saturation > maxSaturation) {
                    maxSaturation = saturation;
                    vibrantColor = { r, g, b };
                }
            }
            const vibrantRgb = `rgb(${vibrantColor.r}, ${vibrantColor.g}, ${vibrantColor.b})`;
            const h2Elements = document.querySelectorAll('h2');
            // Cambiar el color solo de los elementos h2
            h2Elements.forEach((h2) => {
                h2.style.color = vibrantRgb;
            });
            const button = document.querySelector('button');
            if (button) {
                button.style.backgroundColor = vibrantRgb; // Cambia el color de fondo del botón
                button.style.borderColor = vibrantRgb; // Cambia el color del borde del botón
                // Función para calcular el brillo
                function calculateBrightness(color) {
                    return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
                }
                // Determinar el color del texto basado en el brillo
                function updateButtonTextColor() {
                    const brightness = calculateBrightness(vibrantColor);
                    button.style.color = brightness > 186 ? 'black' : 'white'; // Cambia el color del texto
                }
                updateButtonTextColor(); // Establecer color de texto inicial
                button.addEventListener('mouseover', () => {
                    button.style.boxShadow = `0 0 30px 5px rgba(${vibrantColor.r}, ${vibrantColor.g}, ${vibrantColor.b}, 0.815)`; // Cambia el color de la sombra al hacer hover
                    updateButtonTextColor(); // Actualiza el color del texto al hacer hover
                });
                button.addEventListener('mouseout', () => {
                    button.style.boxShadow = '0 0 0 0 transparent';
                    updateButtonTextColor(); // Actualiza el color del texto al salir del hover
                });
            }
        }
    }
    // Manejo de errores en caso de que la imagen no se cargue
    imgElement.onerror = () => {
        console.error('Error al cargar la imagen.');
        // Puedes agregar un manejo adicional, como mostrar una imagen de error
    };
};
// Bg Particles
const particleContainer = document.getElementById('particle-container');
const letters = ['A', 'X', 'Y', 'B', '◯', '△', '▢', '✖️'];
const colors = ['color-a', 'color-x', 'color-y', 'color-b', 'color-circle', 'color-triangle', 'color-cuadrado'];
// Función para crear una partícula
function createParticle() {
    const particle = document.createElement('div');
    const randomIndex = Math.floor(Math.random() * letters.length);
    particle.className = `particle ${colors[randomIndex]}`; // Asignar clase de color
    particle.textContent = letters[randomIndex];
    // Establecer posición inicial en la parte inferior de la pantalla
    particle.style.left = `${Math.random() * 100}vw`; // Posición horizontal aleatoria
    particle.style.bottom = `0`; // Desde la parte inferior
    // Establecer opacidad
    particle.style.opacity = Math.random().toString();
    particleContainer.appendChild(particle);
    // Movimiento curvilíneo
    const duration = 8000; // Duración total de la animación
    const distance = Math.random() * 150 + 100; // Distancia aleatoria (entre 100 y 250px)
    const keyframes = [
        { transform: `translateY(0)`, offset: 0 },
        { transform: `translate(-${Math.random() * 50}px, -${distance}px) rotate(${Math.random() * 20 - 10}deg)`, offset: 0.25 },
        { transform: `translate(-${Math.random() * 50}px, -${distance + 50}px) rotate(${Math.random() * 20 - 10}deg)`, offset: 0.5 },
        { transform: `translate(-${Math.random() * 50}px, -${distance + 100}px) rotate(${Math.random() * 20 - 10}deg)`, offset: 0.75 },
        { transform: `translate(-${Math.random() * 50}px, -${distance + 150}px)`, offset: 1 }
    ];
    // Aplicar la animación
    particle.animate(keyframes, {
        duration: duration,
        easing: 'ease-in-out',
        fill: 'forwards'
    });
    // Desvanecer la partícula
    setTimeout(() => {
        particle.style.opacity = '0'; // Desvanecer
    }, duration - 1000); // Comenzar a desvanecer 1 segundo antes de que termine la animación
    // Eliminar la partícula después de la animación
    setTimeout(() => {
        particle.remove();
    }, duration); // Tiempo para que coincida con la duración de la animación
}
// Generar partículas a intervalos más cortos (cada 1000 ms)
setInterval(createParticle, 1000); // Generar cada 1000 ms para el doble de partículas
