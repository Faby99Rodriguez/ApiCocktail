// En tu archivo favoritosRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./middleware'); // Asegúrate de tener un middleware para verificar el token
const db = require('./db/db'); // Importa tu módulo de base de datos

// Endpoint para obtener jefes favoritos
router.get('/favoritos', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Asume que el usuario está incluido por el middleware
    
    // Consulta a la base de datos para obtener jefes favoritos del usuario
    const [rows] = await db.query('SELECT * FROM JefesFavoritos WHERE UserId = ?', [userId]);
    const jefesFavoritos = rows;

    res.json({ success: true, jefesFavoritos });
  } catch (error) {
    console.error('Error al obtener jefes favoritos:', error.message);
    res.status(500).json({ error: 'Error al obtener jefes favoritos', details: error.message });
  }
});

module.exports = router;
