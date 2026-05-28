import React from 'react';

function AdminPanel() {
  return (
    <div className="admin-box">
      <h2 style={{color: 'var(--verde-selva)', textAlign: 'center'}}>Cargar Nuevo Sonido</h2>
      <form>
        <input type="text" placeholder="Nombre del sonido (ej: Páramo de Sumapaz)" />
        <select>
          <option>Ambiente</option>
          <option>FX/Foley</option>
          <option>Bioacústica</option>
        </select>
        <textarea placeholder="Descripción detallada de la locación y especie..."></textarea>
        <input type="file" />
        <button className="btn-entrar" style={{backgroundColor: 'var(--verde-hoja)', width: '100%', border: 'none', color: 'white', padding: '15px', borderRadius: '5px', cursor: 'pointer'}}>
          Publicar en la Audioteca
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;