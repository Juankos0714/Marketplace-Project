window.onload = () => {
    const imgElement = document.getElementById('div_product-image') as HTMLImageElement | null;

    if (imgElement) {
        if (imgElement.complete) {
            handleImageLoad();
        } else {
            imgElement.onload = handleImageLoad;
        }
    } else {
        console.error('El elemento de imagen no se encontró.');
    }

    function handleImageLoad() {
        const backgroundDiv = document.getElementById('blurred-background') as HTMLElement | null;
        if (backgroundDiv) {
            backgroundDiv.style.backgroundImage = `url(${imgElement?.src})`;
        } else {
            console.error('El elemento de fondo no se encontró.');
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

                const saturation = Math.max(r, g, b) - Math.min(r, g, b);

                if (saturation > maxSaturation) {
                    maxSaturation = saturation;
                    vibrantColor = { r, g, b };
                }
            }

            // Guarda el color vibrante en una variable CSS
            const vibrantRgb = `rgb(${vibrantColor.r}, ${vibrantColor.g}, ${vibrantColor.b})`;
            document.documentElement.style.setProperty('--vibrant-color', vibrantRgb);

            // Aplica estilos a los elementos usando la variable CSS
            const h2Elements = document.querySelectorAll('h2'); // Corregido para seleccionar ambos

            h2Elements.forEach((h2) => {
                h2.style.color = 'var(--vibrant-color)'; // Usando la variable CSS
            });

            const buttonElements = document.querySelectorAll('a#buy-button');

            buttonElements.forEach((element) => {
                const a = element as HTMLAnchorElement; // llamando a la variable a como HTMLAnchorElement
                a.style.backgroundColor = 'var(--vibrant-color)'; // Usando la variable CSS
                a.style.borderColor = 'var(--vibrant-color)'; // Usando la variable CSS

                function calculateBrightness(color: { r: number; g: number; b: number }): number {
                    return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b; 
                }

                function updateButtonTextColor() {
                    const brightness = calculateBrightness(vibrantColor);
                    a.style.color = brightness > 186 ? 'black' : 'white'; // Cambia el color del texto
                }

                updateButtonTextColor(); // Establecer color de texto inicial

                a.addEventListener('mouseover', () => {
                    a.style.boxShadow = `0 0 30px 5px rgba(${vibrantColor.r}, ${vibrantColor.g}, ${vibrantColor.b}, 0.815)`; // Cambia el color de la sombra al hacer hover
                    updateButtonTextColor(); // Actualiza el color del texto al hacer hover
                });
                
                a.addEventListener('mouseout', () => {
                    a.style.boxShadow = '0 0 0 0 transparent';
                    updateButtonTextColor(); // Actualiza el color del texto al salir del hover
                });
            });
        }
    }

    imgElement.onerror = () => {
        console.error('Error al cargar la imagen.');
    };
};