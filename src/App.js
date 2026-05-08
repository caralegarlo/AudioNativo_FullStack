import React, { useState } from 'react';
import Login from './Login';

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <div className="App">
      {!usuario ? (
        <Login onLoginSuccess={setUsuario} />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>Panel de AudioNativo</h1>
          <p>Hola, <strong>{usuario.nombre}</strong></p>
          <p>Tu rol es: <strong>{usuario.rol}</strong></p>
          {usuario.institucion && <p>Institución: {usuario.institucion}</p>}
          <button onClick={() => setUsuario(null)}>Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
}

export default App;