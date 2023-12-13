// middleware.js

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6WyJmYXZvcml0b0BnbWFpbC5jb20iLCJmYXZvcml0b0BnbWFpbC5jb20iXSwiZXhwIjoxNzAyNDA5NzkxfQ.D6uQ89jeq2p245c4F4htSwg3PU4P1XwRyPTsQz2KRic'; // Usa un valor predeterminado si no se proporciona en las variables de entorno

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
    if (err) {
      console.error('Error al verificar el token:', err.message);
      return res.status(403).json({ error: 'Token no válido', details: err.message });
    }

    console.log('Usuario autenticado:', user);
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
