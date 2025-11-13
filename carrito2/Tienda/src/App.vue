<template>
  <div class="container">
    <div class="row justify-end q-mb-md">
      <div class="relative-position">
        <q-btn round color="primary" icon="shopping_cart" @click="mostrarCarrito" size="md" />
        <q-badge v-if="totalItems > 0" color="red" floating class="contador-carrito">
          {{ totalItems }}
        </q-badge>
      </div>
    </div>

    <h1 class="text-center text-bold q-mb-xl">CARRITO DE COMPRAS</h1>

    <div class="justify-center inventario">
      <div v-for="producto in productos" :key="producto.nombre"
        class="producto q-card q-pa-md col-xs-12 col-sm-5 col-md-3">
        <h3 class="text-h5 q-mt-none q-mb-sm">{{ producto.nombre }}</h3>
        <div class="text-center q-mb-sm">
          <img :src="producto.img" alt="" class="producto-img" />
        </div>
        <p class="text-body1 q-mb-sm">{{ producto.Descripcion }}</p>
        <p class="text-h6 text-weight-bold q-mb-md">${{ producto.Precio.toFixed(2) }}</p>

        <div v-if="cantidadDelCarrito(producto) === 0" class="text-center">
          <q-btn color="primary" class="btn full-width" @click="agregarAlCarrito(producto)"
            label="Agregar al carrito" />
        </div>
        <div v-else class="row items-center justify-center contador q-gutter-sm">
          <q-btn round color="secondary" size="sm" @click="agregar(producto)" icon="add" />
          <span class="text-h6">{{ cantidadDelCarrito(producto) }}</span>
          <q-btn round color="secondary" size="sm" @click="quitar(producto)" icon="remove" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Swal from 'sweetalert2'


import play from './assets/play.png'
import controlPlay from './assets/contolPlay.png'
import auriculares from './assets/audifonos.png'
import consola from './assets/reproductor.png'
import xbox from './assets/xbox.png'
import controlXbox from './assets/controlXbox.png'
import volante from './assets/volante.png'
import nintendo from './assets/nintendo.png'

const productos = ref([
  {
    nombre: "PlayStation 5",
    img: play,
    Descripcion: "Consola de última generación con SSD ultrarrápido",
    Precio: 799.99
  },
  {
    nombre: "Control PlayStation 5 DualSense",
    img: controlPlay,
    Descripcion: "Mando inalámbrico DualSense con gatillos adaptativos",
    Precio: 89.99
  },
  {
    nombre: "Consola PlayStation 5 Edición Digital",
    img: consola,
    Descripcion: "Versión sin lector de discos, más compacta y silenciosa.",
    Precio: 699.99
  },
  {
    nombre: "Auriculares Pulse 3D",
    img: auriculares,
    Descripcion: "Auriculares inalámbricos con audio 3D y cancelación de ruido.",
    Precio: 149.99
  },
  {
    nombre: "Xbox Series X",
    img: xbox,
    Descripcion: "La consola más potente de Microsoft",
    Precio: 749.99
  },
  {
    nombre: "Control Xbox Series X/S",
    img: controlXbox,
    Descripcion: "Mando ergonómico con gatillos texturizados y conectividad Bluetooth.",
    Precio: 69.99
  },
  {
    nombre: "Volante Hell Racing Pro",
    img: volante,
    Descripcion: "Volante con retroalimentación de fuerza, pedales ajustables y soporte universal.",
    Precio: 299.99
  },
  {
    nombre: "Nintendo Switch OLED",
    img: nintendo,
    Descripcion: "Consola híbrida con pantalla OLED de 7",
    Precio: 379.99
  }
])


const carrito = ref([])


function cargarCarrito() {
  try {
    const carritoGuardado = localStorage.getItem('carrito')
    if (carritoGuardado) {
      const productosGuardados = JSON.parse(carritoGuardado)

      if (Array.isArray(productosGuardados)) {
        carrito.value = productosGuardados
      } else {
        carrito.value = []
      }
    }
  } catch (e) {
    console.error("Error al cargar el carrito desde localStorage:", e)
    carrito.value = []
  }
}

cargarCarrito()

function agregarAlCarrito(producto) {

  const itemExistente = carrito.value.find(p => p.nombre === producto.nombre)

  if (itemExistente) {
    itemExistente.cantidad++
  } else {

    carrito.value.push({
      ...producto,
      cantidad: 1
    })
  }

  guardarCarrito()
  mostrarMensaje("✅ Producto agregado al carrito")
}

function agregar(producto) {
  const item = carrito.value.find(p => p.nombre === producto.nombre)
  if (item) {
    item.cantidad++
    guardarCarrito()
    mostrarMensaje("✅ Cantidad actualizada")
  }
}

function quitar(producto) {
  const item = carrito.value.find(p => p.nombre === producto.nombre)
  if (item) {
    item.cantidad--
    if (item.cantidad <= 0) {
      carrito.value = carrito.value.filter(p => p.nombre !== producto.nombre)
    }
    guardarCarrito()
    mostrarMensaje("✅ Producto actualizado")
  }
}

function cantidadDelCarrito(producto) {
  const item = carrito.value.find(p => p.nombre === producto.nombre)
  return item ? item.cantidad : 0
}

function guardarCarrito() {
  try {
    localStorage.setItem('carrito', JSON.stringify(carrito.value))
  } catch (e) {
    console.error("Error al guardar el carrito en localStorage:", e)
  }
}

const totalItems = computed(() => {
  return carrito.value.reduce((suma, p) => {
    return suma + (p.cantidad || 0)
  }, 0)
})

const subtotal = computed(() => {
  return carrito.value.reduce((suma, p) => {
    return suma + (p.Precio * (p.cantidad || 0))
  }, 0)
})

const impuesto = computed(() => subtotal.value * 0.16)
const totalFinal = computed(() => subtotal.value + impuesto.value)


watch(carrito, (nuevo) => {
  guardarCarrito()
}, { deep: true })

watch(totalFinal, (nuevo) => {
  if (nuevo > 2000) {
    Swal.fire({
      icon: 'info',
      title: '🚚 ¡Felicidades!',
      text: 'Tu envío será gratis 😊',
      showConfirmButton: false,
      timer: 2000
    })
  }
})

function mostrarMensaje(texto) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: texto,
    showConfirmButton: false,
    timer: 1500,
    background: '#1e1e2f',
    color: '#fff'
  })
}

function mostrarCarrito() {
  console.log("Mostrando carrito. Items:", carrito.value.length)
  console.log("Contenido del carrito:", JSON.stringify(carrito.value))

  if (carrito.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Tu carrito está vacío ',
      showConfirmButton: false,
      timer: 1500
    })
    return
  }

  try {

    let listaProductos = ''
    carrito.value.forEach(p => {
      listaProductos += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <span>${p.nombre}</span>
          <span>${p.cantidad || 0}</span>
        </div>
      `
    })


    let html = `
      <div style="text-align: left; color: white;">
        <div style="max-height: 40vh; overflow-y: auto; margin-bottom: 20px;">
          <h3 style="margin-bottom: 15px; color: #3498db;">Productos en tu carrito:</h3>
          ${listaProductos}
        </div>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>$${subtotal.value.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>IVA (16%):</span>
            <span>$${impuesto.value.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
            <span>Total:</span>
            <span style="color: #2ecc71;">$${totalFinal.value.toFixed(2)}</span>
          </div>
        </div>
        
        ${totalFinal.value > 2000 ?
        `<div style="margin-top: 15px; padding: 10px; background-color: rgba(46, 204, 113, 0.2); border-radius: 5px; text-align: center;">
            <span style="color: #2ecc71;">🚚 ¡Envío gratis incluido!</span>
          </div>` :
        ''}
      </div>
    `

    Swal.fire({
      title: '🛍️ Tu Carrito de Compras',
      html: html,
      background: '#2c2c44',
      color: 'white',
      confirmButtonText: 'Continuar comprando',
      confirmButtonColor: '#3498db',
      showCancelButton: true,
      cancelButtonText: 'Vaciar carrito',
      cancelButtonColor: '#e74c3c',
      width: '500px'
    }).then((result) => {
      if (result.isDismissed) {

        vaciarCarrito()
      }
    })
  } catch (error) {
    console.error("Error al generar el HTML del carrito:", error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo mostrar el carrito. Intente nuevamente.',
      confirmButtonText: 'Cerrar'
    })
  }
}


function vaciarCarrito() {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¿Quieres vaciar todo tu carrito?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#3498db',
    confirmButtonText: 'Sí, vaciar carrito',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.value = []
      guardarCarrito()
      Swal.fire({
        icon: 'success',
        title: 'Carrito vaciado',
        text: 'Todos los productos han sido eliminados de tu carrito',
        showConfirmButton: false,
        timer: 1500
      })
    }
  })
}
</script>

<style>
body {
  overflow-x: hidden;
  background: #0a0a0a;
  font-family: 'Poppins', sans-serif;
}

.container {
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0033 50%, #330066 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  min-height: 100vh;
}

.inventario {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.producto {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 25px;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.producto::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 0, 110, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
  z-index: 1;
}

.producto:hover::before {
  transform: translateX(100%);
}

.producto:hover {
  transform: translateY(-15px) rotateX(5deg);
  box-shadow: 0 20px 40px rgba(131, 56, 236, 0.3);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(131, 56, 236, 0.5);
}

.producto h3 {
  margin-top: 0;
  color: #ff006e;
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  margin-bottom: 15px;
  text-align: center;
  z-index: 2;
  position: relative;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(255, 0, 110, 0.5);
}

.producto img {
  width: 100%;
  height: clamp(150px, 25vw, 200px);
  object-fit: contain;
  border-radius: 15px;
  margin-bottom: 15px;
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  transition: all 0.4s;
  border: 1px solid rgba(255, 255, 255, 0.05);
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
}

.producto:hover img {
  transform: scale(1.05) rotate(2deg);
  filter: drop-shadow(0 10px 20px rgba(131, 56, 236, 0.4));
}

.producto p {
  margin: 8px 0;
  color: #e0e6ed;
  font-size: clamp(0.85rem, 1.8vw, 1rem);
  line-height: 1.6;
  z-index: 2;
  position: relative;
}

.producto p:last-of-type {
  font-weight: 700;
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: #ffbe0b;
  margin-top: 15px;
  text-align: center;
  text-shadow: 0 0 15px rgba(255, 190, 11, 0.5);
}

.contador-carrito {
  min-width: 20px;
  height: 20px;
  font-size: 12px;
}

.btn {
  font-weight: bold;
  background: linear-gradient(45deg, #ff006e, #8338ec);
}

.contador {
  margin-top: 10px;
}
@media (max-width: 499px) and (min-width : 300px){
  .inventario {
    grid-template-columns: 1fr;
  }
  h1{
    font-size: 35px;
    line-height: 3rem;

  }
}

@media (max-width: 900px) and (min-width : 500px) {
  h1{
    font-size: 40px;
    line-height: 3rem;

  }
  .container {
    padding: 15px;
  }
  
  .inventario {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .carrito-fijo {
    width: 50px;
    height: 50px;
    top: 15px;
    right: 15px;
  }
  
  .icono-carrito {
    font-size: 24px;
  }
  
  .contador-carrito {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
}
</style>