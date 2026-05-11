import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// =============================================
// SIDEBAR (usuarios no admin)
// =============================================
function Sidebar({ setPagina, paginaActiva, setUsuario }) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">AudioNativo</div>
      <button
        className={`sidebar-btn ${paginaActiva === 'inicio' ? 'active' : ''}`}
        onClick={() => setPagina('inicio')}
      >
        Inicio
      </button>
      <button
        className={`sidebar-btn ${paginaActiva === 'sonidos' ? 'active' : ''}`}
        onClick={() => setPagina('sonidos')}
      >
        Sonidos
      </button>
      <button
        className={`sidebar-btn ${paginaActiva === 'acerca' ? 'active' : ''}`}
        onClick={() => setPagina('acerca')}
      >
        Acerca de
      </button>
      <div className="sidebar-logout">
        <button onClick={() => setUsuario(null)}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

// =============================================
// INICIO (búsqueda en vivo + orden)
// =============================================
function Inicio() {
  const [busqueda, setBusqueda] = useState('');
  const [todosSonidos, setTodosSonidos] = useState([]);
  const [orden, setOrden] = useState('reciente');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/sonidos')
      .then(res => setTodosSonidos(res.data))
      .catch(err => console.error(err));
  }, []);

  const sonidosFiltrados = todosSonidos
    .filter(s => {
      if (!busqueda.trim()) return false; // ← No mostrar nada si no hay búsqueda
      const termino = busqueda.toLowerCase();
      return (
        s.nombre.toLowerCase().includes(termino) ||
        s.categoria.toLowerCase().includes(termino) ||
        (s.subcategoria && s.subcategoria.toLowerCase().includes(termino)) ||
        (s.descripcion && s.descripcion.toLowerCase().includes(termino))
      );
    })
    .sort((a, b) => {
      if (orden === 'reciente') return b.id - a.id;
      if (orden === 'az') return a.nombre.localeCompare(b.nombre);
      if (orden === 'za') return b.nombre.localeCompare(a.nombre);
      return 0;
    });

  return (
    <div>
      <h2>Explora la Audioteca</h2>
      <div className="search-bar">
        <input
          type="text"
          className="search-input search-input-grande"
          placeholder="Buscar en toda la Audioteca (ej: ave, lluvia, FX...)"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <select className="sort-select" value={orden} onChange={e => setOrden(e.target.value)}>
          <option value="reciente">Más reciente</option>
          <option value="az">A – Z</option>
          <option value="za">Z – A</option>
        </select>
      </div>

      {busqueda.trim() && (
        <p className="results-count">
          {sonidosFiltrados.length} resultado(s) para "{busqueda}"
        </p>
      )}

      {sonidosFiltrados.length > 0 ? (
        <div className="tarjetas-container">
          {sonidosFiltrados.map(s => <TarjetaSonido key={s.id} sonido={s} />)}
        </div>
      ) : busqueda.trim() ? (
        <p>No se encontraron sonidos. Prueba con otro término.</p>
      ) : null}
      {/* Si no hay búsqueda, no se muestra absolutamente nada */}
    </div>
  );
}

// =============================================
// TARJETA DE SONIDO
// =============================================
function TarjetaSonido({ sonido }) {
  return (
    <div className="tarjeta-sonido">
      <h4>{sonido.nombre}</h4>
      <p><strong>Categoría:</strong> {sonido.categoria}</p>
      {sonido.subcategoria && <p><strong>Sub:</strong> {sonido.subcategoria}</p>}
      <p style={{ fontSize: '14px' }}>{sonido.descripcion}</p>
      <audio controls>
        <source src={`http://127.0.0.1:8000/${sonido.ruta_archivo}`} type="audio/mpeg" />
        Tu navegador no soporta el audio.
      </audio>
    </div>
  );
}

// =============================================
// SONIDOS (categorías + orden)
// =============================================
function Sonidos() {
  const [categoria, setCategoria] = useState(null); // null = sin selección, 'todas' = todas
  const [todosSonidos, setTodosSonidos] = useState([]);
  const [orden, setOrden] = useState('reciente');
  const categorias = ['Ambiente', 'FX', 'Foley'];

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/sonidos')
      .then(res => setTodosSonidos(res.data))
      .catch(err => console.error(err));
  }, []);

  // Sin categoría seleccionada → sin resultados
  const sonidosFiltrados = todosSonidos
    .filter(s => {
      if (!categoria) return false;            // aún no elige
      if (categoria === 'todas') return true;  // mostrar todas
      return s.categoria === categoria;        // categoría específica
    })
    .sort((a, b) => {
      if (orden === 'reciente') return b.id - a.id;
      if (orden === 'az') return a.nombre.localeCompare(b.nombre);
      if (orden === 'za') return b.nombre.localeCompare(a.nombre);
      return 0;
    });

  return (
    <div>
      <h2>Sonidos por Categoría</h2>
      <div className="categorias-btns">
        {categorias.map(cat => (
          <button
            key={cat}
            className={`cat-btn ${categoria === cat ? 'active-cat' : ''}`}
            onClick={() => setCategoria(cat)}
          >
            {cat}
          </button>
        ))}
        {categoria && (
          <button className="clear-cat-btn" onClick={() => setCategoria('todas')}>
            Mostrar todas
          </button>
        )}
      </div>

      {/* Mensaje inicial cuando no hay categoría seleccionada */}
      {!categoria && (
        <p className="categoria-prompt">
          Selecciona la categoría que desees para encontrar la variedad sonora que hay.
        </p>
      )}

      {categoria && categoria !== 'todas' && <h3>{categoria} ({sonidosFiltrados.length})</h3>}
      {categoria === 'todas' && <h3>Todas las categorías ({sonidosFiltrados.length})</h3>}

      <div className="sort-wrapper">
        <label>Ordenar: </label>
        <select className="sort-select" value={orden} onChange={e => setOrden(e.target.value)}>
          <option value="reciente">Más reciente</option>
          <option value="az">A – Z</option>
          <option value="za">Z – A</option>
        </select>
      </div>

      {categoria && sonidosFiltrados.length > 0 ? (
        <div className="tarjetas-container">
          {sonidosFiltrados.map(s => <TarjetaSonido key={s.id} sonido={s} />)}
        </div>
      ) : categoria && (
        <p>No hay sonidos en esta categoría.</p>
      )}
    </div>
  );
}

// =============================================
// ACERCA DE
// =============================================
function AcercaDe() {
  return (
    <div className="acerca-de">
      <h2>Acerca de AudioNativo</h2>
      <p>Plataforma para centralizar, preservar y gestionar paisajes sonoros, fauna y Foley de Colombia.</p>
      <p>Orientada a creadores audiovisuales y académicos.</p>
    </div>
  );
}

// =============================================
// PANEL DE ADMINISTRACIÓN
// =============================================
function PanelAdministracion({ setUsuario }) {
  const [formData, setFormData] = useState({ nombre: '', categoria: 'Ambiente', subcategoria: '', descripcion: '' });
  const [archivo, setArchivo] = useState(null);
  const [sonidos, setSonidos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [orden, setOrden] = useState('reciente');

  useEffect(() => {
    cargarSonidos();
  }, []);

  const cargarSonidos = () => {
    axios.get('http://127.0.0.1:8000/api/sonidos')
      .then(res => setSonidos(res.data))
      .catch(err => console.error(err));
  };

  const enviar = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('categoria', formData.categoria);
    data.append('subcategoria', formData.subcategoria);
    data.append('descripcion', formData.descripcion);
    data.append('archivo', archivo);
    try {
      await axios.post('http://127.0.0.1:8000/api/subir-sonido', data);
      alert("✅ Sonido subido exitosamente");
      setFormData({ nombre: '', categoria: 'Ambiente', subcategoria: '', descripcion: '' });
      setArchivo(null);
      cargarSonidos();
    } catch (err) {
      console.error(err);
      alert("❌ Error al subir archivo");
    }
  };

  // Filtrado y orden
  let sonidosFiltrados = [...sonidos];
  if (filtroCategoria !== 'todas') {
    sonidosFiltrados = sonidosFiltrados.filter(s => s.categoria === filtroCategoria);
  }
  sonidosFiltrados.sort((a, b) => {
    if (orden === 'reciente') return b.id - a.id;
    if (orden === 'az') return a.nombre.localeCompare(b.nombre);
    if (orden === 'za') return b.nombre.localeCompare(a.nombre);
    return 0;
  });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <button className="admin-logout-btn" onClick={() => setUsuario(null)}>Cerrar Sesión</button>
      </div>

      {/* Formulario de subida */}
      <form className="upload-form" onSubmit={enviar}>
        <h3>🛠️ Subir Nuevo Sonido</h3>
        <input placeholder="Nombre del Sonido" value={formData.nombre}
          onChange={e => setFormData({...formData, nombre: e.target.value})} required />
        <select value={formData.categoria}
          onChange={e => setFormData({...formData, categoria: e.target.value})}>
          <option value="Ambiente">Ambiente</option>
          <option value="FX">FX (Bioacústica)</option>
          <option value="Foley">Foley</option>
        </select>
        <input placeholder="Subcategoría (ej: Aves)" value={formData.subcategoria}
          onChange={e => setFormData({...formData, subcategoria: e.target.value})} />
        <textarea placeholder="Descripción técnica detallada..." value={formData.descripcion}
          onChange={e => setFormData({...formData, descripcion: e.target.value})} />
        <label>Selecciona el audio (MP3/WAV):</label>
        <input type="file" accept="audio/*" onChange={e => setArchivo(e.target.files[0])} required />
        <button type="submit" className="upload-btn">Publicar en AudioNativo</button>
      </form>

      {/* Gestión de sonidos */}
      <div>
        <h3>📂 Audios en la Audioteca ({sonidosFiltrados.length})</h3>
        <div className="admin-filters">
          <div>
            <label>Filtrar por categoría:</label>
            <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
              <option value="todas">Todas</option>
              <option value="Ambiente">Ambiente</option>
              <option value="FX">FX</option>
              <option value="Foley">Foley</option>
            </select>
          </div>
          <div>
            <label>Ordenar:</label>
            <select value={orden} onChange={e => setOrden(e.target.value)}>
              <option value="reciente">Más reciente</option>
              <option value="az">A – Z</option>
              <option value="za">Z – A</option>
            </select>
          </div>
        </div>

        {sonidosFiltrados.length === 0 ? (
          <p>No hay sonidos con ese filtro.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Subcategoría</th>
                <th>Ruta</th>
              </tr>
            </thead>
            <tbody>
              {sonidosFiltrados.map(s => (
                <tr key={s.id}>
                  <td>{s.nombre}</td>
                  <td>{s.categoria}</td>
                  <td>{s.subcategoria || '-'}</td>
                  <td>{s.ruta_archivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// =============================================
// APP PRINCIPAL (Login + Router)
// =============================================
function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [pagina, setPagina] = useState('inicio');

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = new FormData();
    loginData.append('email', email);
    loginData.append('password', password);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', loginData);
      setUsuario(res.data);
    } catch (err) {
      alert("Credenciales incorrectas o servidor apagado");
    }
  };

  // ======================
  // PANTALLA DE LOGIN
  // ======================
  if (!usuario) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <h2 className="login-title">AudioNativo Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input type="email" placeholder="Correo electrónico" className="login-input"
              onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="login-input"
              onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="login-btn">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  // ======================
  // ADMINISTRADOR
  // ======================
  if (usuario.rol === 'admin') {
    return <PanelAdministracion setUsuario={setUsuario} />;
  }

  // ======================
  // USUARIO NORMAL (PREMIUM / INSTITUTIONAL)
  // ======================
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar setPagina={setPagina} paginaActiva={pagina} setUsuario={setUsuario} />
      <div className="main-content">
        {pagina === 'inicio' && <Inicio />}
        {pagina === 'sonidos' && <Sonidos />}
        {pagina === 'acerca' && <AcercaDe />}
      </div>
    </div>
  );
}

export default App;