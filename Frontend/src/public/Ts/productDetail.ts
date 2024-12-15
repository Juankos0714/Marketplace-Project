interface Product {
    name: string;
    description: string;
    price: number;
    platform: string;
    images: string[];
    requirements: string;
  }
  
  async function fetchProductDetail(): Promise<void> {
    const productId = window.location.pathname.split('/').pop();  // Obtener ID del producto de la URL
  
    if (!productId) {
      console.error('ID de producto no encontrado en la URL');
      return;
    }
  
    try {
      const response = await fetch(`/api/product/${productId}`);
      if (!response.ok) {
        throw new Error('Error al obtener el producto');
      }
  
      const product: Product = await response.json();  // Convertir respuesta a JSON y asegurar que sigue la interfaz Product
  
      // Actualizar el contenido del producto en el DOM
      document.getElementById('product-title')!.textContent = product.name;
      document.getElementById('product-description')!.textContent = product.description;
      document.getElementById('product-price')!.textContent = `Precio: $${product.price}`;
      document.getElementById('product-platform')!.textContent = `Plataforma: ${product.platform}`;
      document.getElementById('product-requirements')!.textContent = product.requirements;
  
      // Mostrar imágenes del producto
      const imagesContainer = document.getElementById('product-image')!;
      product.images.forEach((image) => {
        const imgElement = document.createElement('img');
        imgElement.src = `/uploads/${image}`;  // Ajusta la ruta de imagen según donde estén almacenadas
        imagesContainer.appendChild(imgElement);
      });
    } catch (error) {
      console.error('Error al obtener los detalles del producto:', error);
    }
  }
  
  // Llamada a la función para cargar los detalles del producto
  fetchProductDetail();
  