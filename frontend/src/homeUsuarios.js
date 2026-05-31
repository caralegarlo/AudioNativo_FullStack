import React from 'react';

function HomeUsuarios({ nombreUsuario }) {
  return (
    <div className="main-content" style={{padding: '40px', textAlign: 'center'}}>
      <h1 style={{color: 'var(--verde-selva)'}}>Bienvenido a AudioNativo</h1>
      <p style={{maxWidth: '600px', margin: '0 auto', color: 'var(--tierra)'}}>
        La plataforma líder en preservación sonora de la biodiversidad colombiana. 
        Explora, descarga y estudia los ecosistemas de nuestra tierra.
      </p>

      <div className="category-container">
        <div className="category-card"><h3>🐦 Aves</h3></div>
        <div className="category-card"><h3>🌳 Ambiente</h3></div>
        <div className="category-card"><h3>🎬 FX/Foley</h3></div>
      </div>
    </div>
  );
}

export default HomeUsuarios;