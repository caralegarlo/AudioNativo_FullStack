import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const manejarLogin = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password
      });
      alert(`¡Bienvenido ${respuesta.data.nombre}! Entraste como ${respuesta.data.rol}`);
      onLoginSuccess(respuesta.data);
    } catch (error) {
      alert("Error: Usuario no encontrado en la base de datos");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>AudioNativo - Iniciar Sesión</h2>
      <form onSubmit={manejarLogin}>
        <input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} required /><br/><br/>
        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required /><br/><br/>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;