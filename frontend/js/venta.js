

let productos = [];
let carrito = [];
let stockTemporal = []; 


async function cargarProductos() {
  try {
    const res = await fetch('http://localhost:3000/api/productos/', { cache: "no-store" });
    productos = await res.json();
    stockTemporal = productos.map(p => ({ ...p }));
    renderizarProductos();
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}



// RENDERIZAR PRODUCTOS EN LA VISTA
function renderizarProductos() {
  const contenedor = document.querySelector('.product-grid');
  contenedor.innerHTML = '';

  stockTemporal.forEach(p => {
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


function agregarAlCarrito(id) {
  const productoOriginal = productos.find(p => p.id === id);
  if (!productoOriginal || productoOriginal.stock <= 0) {
    alert('Producto sin stock disponible.');
    return;
  }

  const item = carrito.find(c => c.producto_id === id);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ producto_id: productoOriginal.id, nombre: productoOriginal.nombre, precio: productoOriginal.precio, cantidad: 1 });
  }

  productoOriginal.stock--;
  renderizarCarrito();
  renderizarProductos();
}






// RENDERIZAR CARRITO EN LA VISTA
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


// CAMBIAR CANTIDAD DE UN PRODUCTO
function cambiarCantidad(id, cambio) {
  const item = carrito.find(i => i.id === id);
  const visual = stockTemporal.find(p => p.id === id);

  if (!item || !visual) return;

  if (cambio === 1 && visual.stock <= 0) {
    alert('No hay más stock disponible.');
    return;
  }

  if (cambio === 1) {
    item.cantidad++;
    visual.stock--;
  } else if (cambio === -1) {
    item.cantidad--;
    visual.stock++;
  }

  if (item.cantidad <= 0) {
    carrito = carrito.filter(i => i.id !== id);
  }

  renderizarCarrito();
  renderizarProductos();
}



// PROCESAR COMPRA Y ACTUALIZAR STOCK
async function procesarCompra() {
  //console.log("Productos a enviar:", carrito); // Verifica los datos antes de enviarlos
  try {
    const res = await fetch('http://localhost:3000/api/ventas/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productos: carrito })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    
    carrito = [];

    await new Promise(resolve => setTimeout(resolve, 500));
    await cargarProductos();
    renderizarCarrito();
    alert('¡Compra procesada exitosamente!');
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    alert(`Error: ${error.message}`);
  }
}




// INICIALIZACIÓN AL CARGAR LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();

  const btnBuy = document.querySelector('.btn-buy');
  if (btnBuy) {
    btnBuy.addEventListener('click', procesarCompra);
  }
});


async function cargarMasVendidos() {
  try {
    const res = await fetch('http://localhost:3000/api/productos/mas-vendidos');
    const data = await res.json();

    const tbody = document.getElementById('tabla-mas-vendidos');
    tbody.innerHTML = '';

    data.forEach((producto, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${producto.nombre}</td>
        <td>${producto.cantidadVendida}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error al cargar los más vendidos:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  cargarMasVendidos(); 
});
