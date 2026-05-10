import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- 1. COMPONENTE DE LA GALERÍA (Universal) ---
function GaleriaSonidos() {
    const [sonidos, setSonidos] = useState([]);

    useEffect(() => {
        const obtenerSonidos = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/sonidos');
                setSonidos(res.data);
            } catch (err) {
                console.error("Error al cargar la audioteca:", err);
            }
        };
        obtenerSonidos();
    }, []);

    return (
        <div style={{ marginTop: '30px' }}>
            <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', display: 'inline-block' }}> Audioteca Colombiana</h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '20px', 
                marginTop: '20px' 
            }}>
                {sonidos.length > 0 ? sonidos.map(sonido => (
                    <div key={sonido.id} style={{ 
                        background: 'white', 
                        padding: '20px', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        textAlign: 'left'
                    }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>{sonido.nombre}</h4>
                        <span style={{ background: '#e1f5fe', color: '#01579b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                            {sonido.categoria}
                        </span>
                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '15px 0' }}>{sonido.descripcion}</p>
                        <audio controls style={{ width: '100%', height: '35px' }}>
                            <source src={`http://127.0.0.1:8000/${sonido.ruta_archivo}`} type="audio/mpeg" />
                            Tu navegador no soporta el reproductor.
                        </audio>
                    </div>
                )) : <p>No hay sonidos registrados aún.</p>}
            </div>
        </div>
    );
}

// COMPONENTE DEL PANEL DE ADMIN (Solo para carga)
function AdminPanel() {
    const [formData, setFormData] = useState({
        nombre: '', categoria: 'Ambiente', subcategoria: '', descripcion: ''
    });
    const [archivo, setArchivo] = useState(null);

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
            alert("✅ ¡Sonido publicado con éxito!");
            window.location.reload();
        } catch (err) {
            alert("❌ Error en la base de datos o servidor");
        }
    };

    return (
        <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '15px', border: '1px solid #dee2e6' }}>
            <h3 style={{ marginTop: 0 }}>🛠️ Panel de Gestión (Admin)</h3>
            <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input placeholder="Nombre (ej: Tórtola Común)" style={{ padding: '10px' }} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select style={{ flex: 1, padding: '10px' }} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                        <option value="Ambiente">Ambiente</option>
                        <option value="FX">FX (Bioacústica)</option>
                        <option value="Foley">Foley</option>
                    </select>
                    <input style={{ flex: 1, padding: '10px' }} placeholder="Subcategoría" onChange={e => setFormData({...formData, subcategoria: e.target.value})} />
                </div>
                <textarea style={{ padding: '10px' }} placeholder="Descripción del hábitat o técnica..." onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                <input type="file" accept="audio/*" onChange={e => setArchivo(e.target.files[0])} required />
                <button type="submit" style={{ background: '#27ae60', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Subir a la Audioteca
                </button>
            </form>
        </div>
    );
}

// --- 3. COMPONENTE PRINCIPAL (Lógica de Roles) ---
function App() {
    const [credenciales, setCredenciales] = useState({ email: '', password: '' });
    const [usuario, setUsuario] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('email', credenciales.email);
        data.append('password', credenciales.password);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/login', data);
            setUsuario(res.data);
        } catch (err) {
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div style={{ maxWidth: '1100px', margin: 'auto', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
            {!usuario ? (
                <div style={{ width: '300px', margin: '100px auto', textAlign: 'center' }}>
                    <h2>AudioNativo Login</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="email" placeholder="Email" style={{ padding: '10px' }} onChange={e => setCredenciales({...credenciales, email: e.target.value})} required />
                        <input type="password" placeholder="Password" style={{ padding: '10px' }} onChange={e => setCredenciales({...credenciales, password: e.target.value})} required />
                        <button style={{ padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>Entrar</button>
                    </form>
                </div>
            ) : (
                <div>
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div>
                            <h1>AudioNativo</h1>
                            <p>Bienvenido, <strong>{usuario.nombre}</strong> (Rol: {usuario.rol})</p>
                        </div>
                        <button onClick={() => setUsuario(null)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                            Cerrar Sesión
                        </button>
                    </header>

                    {/* MOSTRAR PANEL SOLO SI ES ADMIN */}
                    {usuario.rol === 'admin' && <AdminPanel />}

                    {/* MOSTRAR GALERÍA PARA TODOS */}
                    <GaleriaSonidos />
                </div>
            )}
        </div>
    );
}

export default App;