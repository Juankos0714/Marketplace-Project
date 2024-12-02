// Bg Particles
const particleContainer = document.getElementById('particle-container') as HTMLElement;
const letters: string[] = ['A', 'X', 'Y', 'B', '◯', '△','▢','✖️'];
const colors: string[] = ['color-a', 'color-x', 'color-y', 'color-b', 'color-circle', 'color-triangle', 'color-cuadrado'];

// Función para crear una partícula
function createParticle(): void {
    const particle = document.createElement('div');
    const randomIndex = Math.floor(Math.random() * letters.length);
    particle.className = `particle ${colors[randomIndex]}`; // Asignar clase de color
    particle.textContent = letters[randomIndex];

    // Establecer posición inicial en la parte inferior de la pantalla
    particle.style.left = `${Math.random() * 100}vw`; // Posición horizontal aleatoria
    particle.style.bottom = `0`; // Desde la parte inferior

    // Establecer opacidad
    particle.style.opacity = Math.random().toString();

    // Evitar que el texto sea seleccionable
    particle.style.userSelect = 'none'; // Evitar selección de texto
    particle.style.pointerEvents = 'none'; // Opcional: evitar interacción con el mouse

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