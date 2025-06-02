
import { API_URL } from "./api/config.js";


const tabla = document.getElementById("product-table-body");
const modal = document.getElementById("modal-overlay");
const form = document.getElementById("form-producto");
const cancelar = document.getElementById("btn-cancelar");
const btnNuevo = document.querySelector(".btn-add-product");

let editando = false;
let productoId = null;

async function obtenerProductos() {
  const res = await fetch(`${API_URL}/productos/`);
  const productos = await res.json();
  renderProductos(productos);
}

function renderProductos(productos) {
  tabla.innerHTML = "";
  productos.forEach(producto => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td><span style="color: #d26800;">$${producto.precio}</span></td>
      <td>${producto.stock} Unidades</td>
      <td>
        <button class="btn-action edit" onclick="editarProducto(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">✏️</button>
        
      </td>
    `;
    tabla.appendChild(fila);
  });
}

window.editarProducto = (id, nombre, precio, stock) => {
  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("stock").value = stock;
  editando = true;
  productoId = id;
  modal.style.display = "flex";
};

window.eliminarProducto = async (id) => {
  if (confirm("¿Estás segura de que quieres eliminar este producto?")) {
    try {
         const detalle = await fetch(`${API_URL}/productos/del/${id}`, { method: "DELETE" });
         const data = await detalle.json();
         if (data.error) {
             alert(`❌ ${data.error}`);
         }
        
    } catch (error) {
         alert(`❌ Error al eliminar producto:\n${error}`);
    }
   
   
    obtenerProductos();
  }
};

btnNuevo.addEventListener("click", () => {
  form.reset();
  editando = null;
  modal.style.display = "flex";
});

cancelar.addEventListener("click", () => {
  modal.style.display = "none";
  form.reset();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    precio: parseFloat(document.getElementById("precio").value),
    stock: parseInt(document.getElementById("stock").value),
  };


  if (editando) {
    await fetch(`${API_URL}/productos/put/${productoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } else {
    await fetch(`${API_URL}/productos/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  modal.style.display = "none";
  form.reset();
  obtenerProductos();
});

obtenerProductos();




