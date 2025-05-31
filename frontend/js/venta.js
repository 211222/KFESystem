// venta.js

// ==============================
// VARIABLES GLOBALES
// ==============================

let productos = [];
let carrito = [];

// ==============================
// CARGAR PRODUCTOS DEL BACKEND
// ==============================

async function cargarProductos() {
  try {
    const res = await fetch('http://localhost:3000/api/productos/');
    productos = await res.json();
    renderizarProductos();
  } catch (error) {
    console.error('Error al cargar productos:', error);
    alert('No se pudieron cargar los productos.');
  }
}

// ==============================
// RENDERIZAR PRODUCTOS EN LA VISTA
// ==============================

function renderizarProductos() {
  const contenedor = document.querySelector('.product-grid');
  contenedor.innerHTML = '';

  productos.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <h3 class="product-name">${p.nombre}</h3>
      <p class="product-price">$${p.precio}</p>
      <p class="product-stock">Stock: ${p.stock}</p>
      <button class="btn-add" onclick="agregarAlCarrito(${p.id})">+ Agregar</button>
    `;
    contenedor.appendChild(card);
  });
}

// ==============================
// AGREGAR PRODUCTO AL CARRITO
// ==============================

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto || producto.stock <= 0) {
    alert('Producto sin stock disponible.');
    return;
  }

  const item = carrito.find(c => c.id === id);
  if (item) {
    if (item.cantidad < producto.stock) {
      item.cantidad++;
    } else {
      alert('No hay más stock disponible.');
    }
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  renderizarCarrito();
}

// ==============================
// RENDERIZAR CARRITO EN LA VISTA
// ==============================

function renderizarCarrito() {
  const contenedor = document.querySelector('.cart-items');
  contenedor.innerHTML = '';

  let total = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <strong>${item.nombre}</strong>
      <p>${item.precio} x ${item.cantidad}</p>
      <div class="cart-controls">
        <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
        <span>${item.cantidad}</span>
        <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
      </div>
    `;

    contenedor.appendChild(div);
  });

  document.querySelector('.cart-total').textContent = `$${total.toFixed(2)}`;
}

// ==============================
// CAMBIAR CANTIDAD DE UN PRODUCTO
// ==============================

function cambiarCantidad(id, cambio) {
  const item = carrito.find(i => i.id === id);
  const producto = productos.find(p => p.id === id);

  if (!item || !producto) return;

  const nuevaCantidad = item.cantidad + cambio;

  if (nuevaCantidad > producto.stock) {
    alert('No hay suficiente stock.');
    return;
  }

  if (nuevaCantidad <= 0) {
    carrito = carrito.filter(i => i.id !== id);
  } else {
    item.cantidad = nuevaCantidad;
  }

  renderizarCarrito();
}

// ==============================
// PROCESAR COMPRA Y ACTUALIZAR STOCK
// ==============================

async function procesarCompra() {
  if (carrito.length === 0) {
    alert('No hay productos en el carrito.');
    return;
  }

  try {
    for (const item of carrito) {
      const nuevoStock = item.stock - item.cantidad;

      await fetch(`http://localhost:3000/productos/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: nuevoStock })
      });
    }

    carrito = [];
    await cargarProductos();
    renderizarCarrito();
    alert('¡Compra realizada exitosamente!');
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    alert('Error al procesar la compra.');
  }
}

// ==============================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();

  const btnBuy = document.querySelector('.btn-buy');
  if (btnBuy) {
    btnBuy.addEventListener('click', procesarCompra);
  }
});
