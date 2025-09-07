const db = require('./db');

const initDB = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        precio DECIMAL(10,2),
        stock INT
      )
    `);
    console.log('✅ Tabla productos verificada o creada');

    await db.query(`
      CREATE TABLE IF NOT EXISTS ventas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla ventas verificada o creada');

    await db.query(`
      CREATE TABLE IF NOT EXISTS detalles_venta (
        id INT AUTO_INCREMENT PRIMARY KEY,
        venta_id INT,
        producto_id INT,
        cantidad INT,
        FOREIGN KEY (venta_id) REFERENCES ventas(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
      )
    `);
    console.log('✅ Tabla detalles_venta verificada o creada');

  } catch (err) {
    console.error('❌ Error en la creación de tablas:', err.message);
  }
};

module.exports = initDB;
