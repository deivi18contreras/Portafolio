document.addEventListener('DOMContentLoaded', () => {
  const header = document.createElement('header');
  const h1 = document.createElement('h1');
  h1.textContent = 'Bienvenidos al restaurante Doña Teresa';
  const p = document.createElement('p');
  p.textContent = 'Vivan una experiencia inolvidable con nosotros';
  header.appendChild(h1);
  header.appendChild(p);
  document.body.insertBefore(header, document.querySelector('.contenedor'));

  const STORAGE_KEY = "mesas_restaurante_v1";
  const RESERVAS_KEY = "reservas_restaurante_v1";

  function obtenerMesas() {
    const mesasGuardadas = localStorage.getItem(STORAGE_KEY);
    return mesasGuardadas ? JSON.parse(mesasGuardadas) : [];
  }

  function obtenerReservas() {
    const reservasGuardadas = localStorage.getItem(RESERVAS_KEY);
    return reservasGuardadas ? JSON.parse(reservasGuardadas) : [];
  }

  function actualizarEstadoMesa(numeroMesa, nuevoEstado) {
    const mesas = obtenerMesas();
    const mesaIndex = mesas.findIndex(m => m.numero === numeroMesa);
    if (mesaIndex !== -1) {
      mesas[mesaIndex].estado = nuevoEstado;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
      pintarMesas(); // Repintar para mostrar cambios
    }
  }

  function verificarEstadoMesa(numeroMesa) {
    const reservas = obtenerReservas();
    const now = new Date();
    const hoy = now.toISOString().split('T')[0];
    
    // Buscar reservas activas para esta mesa
    const reservaActiva = reservas.find(r => 
      r.idMesaAsignada === numeroMesa && 
      r.fechaReserva >= hoy && 
      (r.estado === 'Confirmada' || r.estado === 'Pendiente')
    );
    
    return reservaActiva ? 'Ocupada' : 'Disponible';
  }

  function guardarMesa(mesa) {
    const mesas = obtenerMesas();
    mesas.push(mesa);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
  }

  function pintarMesas() {
    const lista = document.getElementById('listaMesas');
    lista.innerHTML = "";
    const mesas = obtenerMesas();

    if (mesas.length === 0) {
      lista.innerHTML = "<p>No hay mesas registradas.</p>";
      return;
    }

    mesas.forEach((mesa, index) => {
      // Verificar estado actual de la mesa
      const estadoActual = verificarEstadoMesa(mesa.numero);
      if (estadoActual !== mesa.estado) {
        mesa.estado = estadoActual;
        actualizarEstadoMesa(mesa.numero, estadoActual);
      }

      const card = document.createElement('div');
      card.classList.add('mesa-card');
      
      // Clases de estado para colores
      let estadoClass = "estado-disponible";
      if (mesa.estado.toLowerCase() === "ocupada") {
        estadoClass = "estado-ocupada";
      }

      card.innerHTML = `
        <h4>Mesa ${mesa.numero}</h4>
        <p>Capacidad: ${mesa.capacidad} personas</p>
        <p>Ubicación: ${mesa.lugar}</p>
        <p class="${estadoClass}">${mesa.estado}</p>
        <div class="botones-mesa">
          <button class="btn btn-success btn-sm btn-reservar" data-mesa="${mesa.numero}" ${mesa.estado === 'Ocupada' ? 'disabled' : ''}>
            Reservar
          </button>
          <button class="btn btn-warning btn-sm btn-editar" data-index="${index}">Editar</button>
          <button class="btn btn-danger btn-sm btn-eliminar" data-index="${index}">Eliminar</button>
        </div>
      `;
      lista.appendChild(card);
    });

    //  Reservar 
    document.querySelectorAll('.btn-reservar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const numeroMesa = e.target.getAttribute('data-mesa');

        // Buscar mesa para obtener la capacidad
        const mesas = obtenerMesas();
        const mesaSeleccionadaObj = mesas.find(m => m.numero === numeroMesa);

        // Guardar mesa seleccionada y capacidad para usar en reservas.html
        sessionStorage.setItem('mesaSeleccionada', numeroMesa);
        if (mesaSeleccionadaObj) {
          sessionStorage.setItem('capacidadMesa', mesaSeleccionadaObj.capacidad);
        }

        window.location.href = "reservas.html";
      });
    });

    // editar//
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const mesas = obtenerMesas();
        const mesa = mesas[index];

        document.getElementById("numero").value = mesa.numero;
        document.getElementById("capaMesa").value = mesa.capacidad;
        document.getElementById("lugarMesa").value = mesa.lugar;
        document.getElementById("estadoMesa").value = mesa.estado;
        document.getElementById("numero").setAttribute('data-edit-index', index);

        if (!modalInstance) modalInstance = new bootstrap.Modal(miModalEl);
        modalInstance.show();
      });
    });

    //eliminar//
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        const mesas = obtenerMesas();
        const mesaNumero = mesas[index].numero;

        Swal.fire({
          title: `¿Eliminar la mesa ${mesaNumero}?`,
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, eliminar"
        }).then((result) => {
          if (result.isConfirmed) {
            mesas.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
            pintarMesas();
            Swal.fire("Eliminado", "La mesa ha sido eliminada.", "success");
          }
        });
      });
    });
  }

  const miModalEl = document.getElementById('miModal');
  let modalInstance = null;

  document.getElementById("btnAgregar").addEventListener("click", () => {
    document.getElementById("numero").value = "";
    document.getElementById("capaMesa").value = "";
    document.getElementById("lugarMesa").value = "";
    document.getElementById("estadoMesa").value = "Disponible";
    document.getElementById("numero").removeAttribute("data-edit-index");

    if (!modalInstance) modalInstance = new bootstrap.Modal(miModalEl);
    modalInstance.show();
  });

  document.getElementById("btnReservas").addEventListener("click", () => {
    window.location.href = "reservas.html";
  });

  document.getElementById("numero").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });
  document.getElementById("capaMesa").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

  document.getElementById("btnGuardar").addEventListener("click", () => {
    const numero = document.getElementById("numero").value.trim();
    const capacidad = document.getElementById("capaMesa").value.trim();
    const lugar = document.getElementById("lugarMesa").value.trim();
    const estado = document.getElementById("estadoMesa").value.trim();
    const editIndex = document.getElementById("numero").getAttribute("data-edit-index");

    if (!numero) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar el número de la mesa" });
      return;
    }
    if (!capacidad) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar la capacidad de la mesa" });
      return;
    }
    if (!lugar) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar la ubicación de la mesa" });
      return;
    }

    const mesas = obtenerMesas();

    if (editIndex !== null) {
      mesas[editIndex] = { numero, capacidad, lugar, estado };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
      Swal.fire("Actualizado", "Mesa actualizada correctamente", "success");
    } else {
      if (mesas.some(m => m.numero === numero)) {
        Swal.fire({ icon: "warning", title: "Mesa ya registrada", text: `La mesa ${numero} ya existe` });
        return;
      }
      guardarMesa({ numero, capacidad, lugar, estado });
      Swal.fire("Éxito", "Mesa guardada correctamente", "success");
    }

    document.getElementById("numero").value = "";
    document.getElementById("capaMesa").value = "";
    document.getElementById("lugarMesa").value = "";
    document.getElementById("estadoMesa").value = "Disponible";
    document.getElementById("numero").removeAttribute("data-edit-index");

    pintarMesas();
    if (modalInstance) modalInstance.hide();
  });

  pintarMesas();
});
