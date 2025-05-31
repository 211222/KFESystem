# BACKEND 


### 🧰TECNOLOGIAS Y LIBRERIAS USADAS


* Node.js
* EXPRESS
* MYSQL
* dontev
* NODEMON
* mysql2

Antes de comenzar asegurarnos de tener instalado 

* Node.js
* MySQL

### 🛠️INSTALAR DEPENDENCIAS
Debemos ubicarnos en la raiz del proyecto para despues ejecutar lo siguiente:

```
npm init -y
npm install express mysql2 dotenv
npm install --save-dev nodemon

```






### 📦MODULO DE PRODUCTOS

Las funciones disponibles en este modulo son:

```
GET /api/productos/ → Obtener todos los productos
```
```
 POST /api/productos/add → Crear un producto
```

```
 PUT /api/productos/:id → Actualizar un producto
```
```
DELETE /api/productos/:id → Eliminar un producto
```

### IMPLEMENTACION TECNICA 

* En modelo productModel.js y ventasModel se manejan las operaciones SQL
* El controlador productoController.js y ventasController.js valida los datos y responde al cliente 

### 🚀VALIDACIONES IMPORTANTES  

*  Se verifica que haya suficiente stock antes de descontar.
*  Se manejan errores con try/catch y se devuelve un mensaje adecuado al cliente.

  
### 🧾MANEJO DE LA BASE DE DATOS  

*  Se usa createPool para manejar múltiples conexiones concurrentes

### 🛠️VARIABLE DE ENTORNO
En el archivo llamado .env se tiene que configurar las variables con los datos correspondientes

```
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=kfe_db
PORT=3000


```
### PROBAR BACKEND 

Despues de asegurarnos que la base de datos este corriendo de manera correcta, lo siguiente es correr el servidor de la siguiente manera:
  
```
npm run dev



```
