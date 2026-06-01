from fastapi import FastAPI, HTTPException, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import mysql.connector
import shutil
import os
from pathlib import Path

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de Base de Datos
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345",
    database="audionativo_db"
)

# Crear carpeta de uploads si no existe y servirla
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- RUTAS ---

@app.post("/api/login")
def login(email: str = Form(...), password: str = Form(...)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE email=%s AND password=%s", (email, password))
    user = cursor.fetchone()
    if user:
        return user
    raise HTTPException(status_code=401, detail="Credenciales incorrectas")

@app.get("/api/sonidos")
def obtener_sonidos():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sonidos")
    return cursor.fetchall()

@app.get("/api/sonidos/buscar")
def buscar_sonidos(q: str = ""):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sonidos WHERE nombre LIKE %s OR descripcion LIKE %s", (f"%{q}%", f"%{q}%"))
    return cursor.fetchall()

@app.post("/api/subir-sonido")
async def subir_sonido(
    nombre: str = Form(...),
    categoria: str = Form(...),
    subcategoria: str = Form(...),
    descripcion: str = Form(...),
    archivo: UploadFile = File(...)
):  # <--- Mira que aquí solo haya UN paréntesis y los dos puntos.
    
    # Validación
    if archivo.content_type not in ["audio/mpeg", "audio/wav"]:
        raise HTTPException(status_code=400, detail="Solo se permiten archivos MP3 o WAV")

    try:
        # código para guardar el archivo
        ruta_final = Path("uploads") / archivo.filename
        with ruta_final.open("wb") as buffer:
            shutil.copyfileobj(archivo.file, buffer)

        # código de base de datos
        cursor = db.cursor()
        sql = "INSERT INTO sonidos (nombre, categoria, subcategoria, descripcion, ruta_archivo) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (nombre, categoria, subcategoria, descripcion, str(ruta_final)))
        db.commit()
        return {"message": "Sonido cargado con éxito"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))