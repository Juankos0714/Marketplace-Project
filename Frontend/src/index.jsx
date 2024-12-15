import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Header from './partials/Header';
import Slider from './partials/Slider';
import Footer from './partials/Footer';

const Index = ({ products }) => (
  <>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Lab Gaming - Marketplace</title>
      <link rel="stylesheet" href="/styles/stylesDefault.css" />
      <link rel="stylesheet" href="/styles/stylesprin.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Press+Start+2P&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    </head>
    <div className="max-width">
      <Header />
      <main className="main">
        <Slider />
        <section className="main_section main_section--destacados">
          <div className="destacadosTitulo section_titulo">
            <h2>Destacados de Lab Gaming</h2>
            <div className="logo">
              <img src="/images/products/logo.png" className="logo-body" />
            </div>
          </div>
          <div className="juegos">
            {products.map(product => (
              <article className="juego" key={product.id}>
                <img src={`/images/products/${product.image}`} alt={product.name} />
                <h2>{product.name}</h2>
                <p>${product.price}</p>
                <div className="div-button">
                  <a href={`/product/${product.id}`} className="button">Comprar</a>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="main_section main_section--novedades">
          <div className="novedadesTitulo section_titulo">
            <h2>Novedades de Lab Gaming</h2>
            <div className="logo">
              <img src="/images/products/logo.png" className="logo-body" />
            </div>
          </div>
          <div className="juegos juegos-novedades">
            {products.map(product => (
              <article className="juego" key={product.id}>
                <img src={`/images/products/${product.image}`} alt={product.name} />
                <h2>{product.name}</h2>
                <p>${product.price}</p>
                <div className="div-button">
                  <a href={`/product/${product.id}`} className="button">Comprar</a>
                </div>
              </article>
            ))}
          </div>
          <aside className="section_aside section_aside--juegosGratis">
            <div className="top">
              <h2 className="section_titulo">Juegos gratis</h2>
              <p>Explora juegos gratis de nuestra colección.</p>
            </div>
            <div className="juegos">
              {products.map(product => (
                <a href={`/product/${product.id}`} key={product.id}>
                  <article className="juego">
                    <div className="imagen">
                      <img src={`/images/products/${product.image}`} alt={product.name} />
                    </div>
                    <div className="info-game">
                      <h2>{product.name}</h2>
                      <p>${product.price}</p>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  </>
);

export default Index;
ReactDOM.render(<App />, document.getElementById('root'));