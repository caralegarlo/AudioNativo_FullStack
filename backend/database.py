# database.py - Conector de AudioNativo a MySQL
import mysql.connector
from mysql.connector import Error

def obtener_conexion():
    try:
        # Configuración de la conexión
        conexion = mysql.connector.connect(
            host='localhost',
            user='root',
            password='12345', 
            database='audionativo_db'
        )
        
        if conexion.is_connected():
            return conexion
            
    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None