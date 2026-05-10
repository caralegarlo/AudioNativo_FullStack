import React, { useState } from 'react';
import axios from 'axios';

// --- COMPONENTE DEL PANEL DE ADMIN ---
function AdminPanel() {
    const [formData, setFormData] = useState({
        nombre: '', categoria: 'Ambiente', subcategoria: '', descripcion: ''
    });
    const [archivo, setArchivo] = useState(null);

    const enviar = async (e) => {
        e.preventDefault();
        console.log("Intentando subir archivo..."); // Para ver en la consola (F12)
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('categoria', formData.categoria);
        data.append('subcategoria', formData.subcategoria);
        data.append('descripcion', formData.descripcion);
        data.append('archivo', archivo);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/subir-sonido', data);
            console.log("Respuesta del servidor:", res.data);
            alert("✅ Sonido subido exitosamente");
            window.location.reload();
        } catch (err) {
            console.error("Error al subir:", err);
            alert("❌ Error al subir archivo");
        }
    };

    return (
        <div style={{ background: '#f0f2f5', padding: '30px', borderRadius: '15px', marginTop: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1a1a1a' }}>🛠️ Gestión de Sonidos (Admin)</h3>
            <form onSubmit={enviar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input style={{ padding: '10px' }} placeholder="Nombre del Sonido" onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                <select style={{ padding: '10px' }} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                    <option value="Ambiente">Ambiente</option>
                    <option value="FX">FX (Bioacústica)</option>
                    <option value="Foley">Foley</option>
                </select>
                <input style={{ padding: '10px' }} placeholder="Subcategoría (ej: Aves)" onChange={e => setFormData({...formData, subcategoria: e.target.value})} />
                <textarea style={{ padding: '10px', minHeight: '80px' }} placeholder="Descripción técnica detallada..." onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                <label>Selecciona el audio (MP3/WAV):</label>
                <input type="file" accept="audio/*" onChange={e => setArchivo(e.target.files[0])} required />
                <button type="submit" style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Publicar en AudioNativo
                </button>
            </form>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL ---
function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usuario, setUsuario] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Botón Entrar presionado con:", email, password); // Verificación en consola

        const loginData = new FormData();
        loginData.append('email', email);
        loginData.append('password', password);

        try {
            const res = await axios.post('http://127.0.0.1:8000/api/login', loginData);
            console.log("Login exitoso:", res.data);
            setUsuario(res.data);
        } catch (err) {
            console.error("Error en login:", err);
            alert("Credenciales incorrectas o servidor apagado");
        }
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
            {!usuario ? (
                <div style={{ width: '350px', margin: 'auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px' }}>
                    <h2 style={{ textAlign: 'center' }}>AudioNativo Login</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input 
                            type="email" 
                            placeholder="Correo electrónico" 
                            style={{ padding: '10px' }} 
                            onChange={e => setEmail(e.target.value)} 
                            value={email}
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            style={{ padding: '10px' }} 
                            onChange={e => setPassword(e.target.value)} 
                            value={password}
                            required 
                        />
                        <button type="submit" style={{ padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Entrar
                        </button>
                    </form>
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <h1>Bienvenido a AudioNativo</h1>
                    <div style={{ background: '#e8f4fd', display: 'inline-block', padding: '10px 20px', borderRadius: '20px' }}>
                        <p>Usuario: <strong>{usuario.nombre}</strong> | Rol: <strong>{usuario.rol}</strong></p>
                    </div>
                    
                    {usuario.rol === 'admin' && <AdminPanel />}
                    
                    <br/>
                    <button onClick={() => setUsuario(null)} style={{ marginTop: '30px', background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;