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
    // Evitar que el texto sea seleccionable
    particle.style.userSelect = 'none'; // Evitar selección de texto
    particle.style.pointerEvents = 'none'; // Opcional: evitar interacción con el mouse
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
