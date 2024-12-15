import React from 'react';
import { Helmet } from 'react-helmet';

const Catalog = ({ products }) => {
  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&amp;display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Press+Start+2P&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <link rel="stylesheet" href="/styles/stylesDefault.css" />
        <link rel="stylesheet" href="/styles/catalogo.css" />
        <title>Gaming Catalog</title>
      </Helmet>
      <div className="max-width">
        {/* Barra de navegación */}
        <header></header>
        <main className="main">
          <div className="sidebar">
            <h3>Consola</h3>
            <ul>
              <li><a href="#ps4">PS4</a></li>
              <li><a href="#ps5">PS5</a></li>
              <li><a href="#pc">PC</a></li>
              <li><a href="#xbox">XBOX</a></li>
            </ul>

            <h3>Géneros</h3>
            <ul>
              <li><a href="#accion">Acción</a></li>
              <li><a href="#aventura">Aventura</a></li>
              <li><a href="#deportes">Deportes</a></li>
              <li><a href="#estrategia">Carrera</a></li>
            </ul>

            <div className="price-filter">
              <h3>Filtro de Precios</h3>
              <label htmlFor="min-price">Precio Mínimo</label>
              <input id="min-price" placeholder="0" type="number" />
              <label htmlFor="max-price">Precio Máximo</label>
              <input id="max-price" placeholder="1000000" type="number" />
              <div className="div-button">
                <a href="#" className="button">Aplicar</a>
              </div>
            </div>
          </div>

          <div className="catalog">
            <h2>Categorías/Catálogo</h2>
            {products.map((product) => (
              <article className="item" key={product.id}>
                <img src={product.image} alt={product.name} />
                <h2>{product.name}</h2>
                <p>${product.price}</p>
                <div className="div-button">
                  <a href={`/product/${product.id}`} className="button">Comprar</a>
                </div>
              </article>
            ))}
          </div>
        </main>
        <footer></footer>
      </div>
    </React.Fragment>
  );
};

export default Catalog;