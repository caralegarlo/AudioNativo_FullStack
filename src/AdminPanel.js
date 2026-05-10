import React, { useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [formData, setFormData] = useState({
    nombre: '', categoria: 'Ambiente', subcategoria: '', descripcion: ''
  });
  const [archivo, setArchivo] = useState(null);

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('categoria', formData.categoria);
    data.append('subcategoria', formData.subcategoria);
    data.append('descripcion', formData.descripcion);
    data.append('archivo', archivo);

    try {
      await axios.post('http://127.0.0.1:8000/api/subir-sonido', data);
      alert("¡Sonido subido con éxito!");
    } catch (error) {
      alert("Error al subir el sonido");
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
      <h3>Panel de Administración - Cargar Nuevo Sonido</h3>
      <form onSubmit={enviarFormulario}>
        <input name="nombre" placeholder="Nombre del sonido" onChange={manejarCambio} required /><br/><br/>
        <select name="categoria" onChange={manejarCambio}>
          <option value="Ambiente">Ambiente</option>
          <option value="FX">FX (Bioacústica)</option>
          <option value="Foley">Foley</option>
        </select><br/><br/>
        <input name="subcategoria" placeholder="Subcategoría (ej: Aves)" onChange={manejarCambio} /><br/><br/>
        <textarea name="descripcion" placeholder="Descripción detallada..." onChange={manejarCambio} /><br/><br/>
        <input type="file" onChange={(e) => setArchivo(e.target.files[0])} required /><br/><br/>
        <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white' }}>Subir a AudioNativo</button>
      </form>
    </div>
  );
}

export default AdminPanel;