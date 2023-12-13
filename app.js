require('dotenv').config();
const express = require('express');
const cors = require('cors');  // Importa el paquete cors
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const favoritosRoutes = require('./favoritosRoutes'); 
const db = require('./db/db');

app.use(cors());

// Usa las rutas de favoritos
app.use('/api', favoritosRoutes); 

app.use(express.json());

app.get('/cocktails', async (req, res) => {
  try {
    const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
    const cock = response.data.body;

    const [rows] = await db.query('SELECT * FROM CocktailsFavoritos');
    const cocktailsFavoritos = rows;

    res.json({ cock, cocktailsFavoritos });
  } catch (error) {
    console.error('Error al obtener la información:', error);

    // Devolver un error más detallado al cliente
    res.status(500).json({ error: 'Error al obtener la información', details: error.message });
  }
});

app.post('/favoritos/agregar', async (req, res) => {
  const { nombre, imagen } = req.body;

  try {
    if (!nombre) {
      return res.status(400).json({ error: 'Se requiere nombre' });
    }

    console.log('Insertando en la base de datos:', nombre, imagen);

    const [result] = await db.query(
      'INSERT INTO CocktailsFavoritos (Nombre, Imagen) VALUES (?, ?)',
      [nombre, imagen]
    );

    console.log('Resultado de la inserción:', result);

    const [cocktailsAgregados] = await db.query('SELECT * FROM CocktailsFavoritos WHERE Nombre = ?', [nombre]);

    console.log('Cocktails agregados:', cocktailsAgregados);

    if (cocktailsAgregados.length > 0) {
      const cocktailsAgregado = cocktailsAgregados[0];
      console.log('Cocktail favorito agregado correctamente:', cocktailsAgregado);
      res.status(201).json({ success: true, message: 'Cocktails favorito agregado correctamente', cocktailsAgregado });
    } else {
      console.error('Error al agregar cocktail favorito: No se pudo obtener el cocktail agregado');
      res.status(500).json({ error: 'Error al agregar cocktail favorito', details: 'No se pudo obtener el cocktail agregado' });
    }
  } catch (error) {
    console.error('Error al agregar cocktail favorito:', error);

    // Devolver un error más detallado al cliente
    res.status(500).json({ error: 'Error al agregar cocktail favorito', details: error.message });
  }
});


app.delete('/favoritos/quitar/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM CocktailsFavoritos WHERE Id = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Cocktail favorito eliminado' });
    } else {
      res.status(404).json({ error: 'Cocktail favorito no encontrado', details: 'No se pudo encontrar y eliminar' });
    }
  } catch (error) {
    console.error('Error al quitar cocktails:', error.message);
    res.status(500).json({ error: 'Error', details: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`El servidor está escuchando en http://0.0.0.0:${port}`);
});
