// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initDB = require('./initDB')

const app = express();
app.use(cors());
app.use(express.json());

const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');


app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);

//iniciar la base de datos y crear tablas
initDB();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
