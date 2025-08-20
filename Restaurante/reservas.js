document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "reservas_restaurante_v1";
  const MESAS_KEY = "mesas_restaurante_v1";

  function obtenerReservas() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function obtenerMesas() {
    const data = localStorage.getItem(MESAS_KEY);
    return data ? JSON.parse(data) : [];
  }

  function actualizarEstadoMesa(numeroMesa, nuevoEstado) {
    const mesas = obtenerMesas();
    const mesaIndex = mesas.findIndex(m => m.numero === numeroMesa);
    if (mesaIndex !== -1) {
      mesas[mesaIndex].estado = nuevoEstado;
      localStorage.setItem(MESAS_KEY, JSON.stringify(mesas));
    }
  }

  function guardarReserva(reserva) {
    const reservas = obtenerReservas();
    reservas.push(reserva);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
    // Actualizar estado de la mesa a Ocupada
    actualizarEstadoMesa(reserva.idMesaAsignada, 'Ocupada');
  }

  function eliminarReserva(idReserva) {
    const reservas = obtenerReservas();
    const reservaIndex = reservas.findIndex(r => r.idReserva === idReserva);
    if (reservaIndex !== -1) {
      const numeroMesa = reservas[reservaIndex].idMesaAsignada;
      reservas.splice(reservaIndex, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
      // Actualizar estado de la mesa a Disponible
      actualizarEstadoMesa(numeroMesa, 'Disponible');
      return true;
    }
    return false;
  }

  function pagarFactura(idReserva) {
    const reservas = obtenerReservas();
    const reservaIndex = reservas.findIndex(r => r.idReserva === idReserva);
    if (reservaIndex !== -1) {
      const numeroMesa = reservas[reservaIndex].idMesaAsignada;
      reservas[reservaIndex].estado = 'Finalizada';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
      // Mesa queda disponible
      actualizarEstadoMesa(numeroMesa, 'Disponible');
      return true;
    }
    return false;
  }

  function cargarSelectorMesas() {
    const mesaInput = document.getElementById("idMesaAsignada");

    // Convertir input a select si no es ya un select
    if (mesaInput.tagName === 'INPUT') {
      const select = document.createElement('select');
      select.id = "idMesaAsignada";
      select.className = "form-control mb-3";
      select.required = true;
      mesaInput.parentNode.replaceChild(select, mesaInput);
    }

    const selector = document.getElementById("idMesaAsignada");
    const mesas = obtenerMesas();

    // Limpiar opciones existentes
    selector.innerHTML = '<option value="" disabled selected>Selecciona una mesa disponible</option>';

    // Filtrar solo mesas disponibles
    const mesasDisponibles = mesas.filter(mesa => mesa.estado === 'Disponible');

    mesasDisponibles.forEach(mesa => {
      const option = document.createElement('option');
      option.value = mesa.numero;
      option.textContent = `Mesa ${mesa.numero} - ${mesa.capacidad} personas - ${mesa.lugar}`;
      selector.appendChild(option);
    });

    // Si hay una mesa preseleccionada desde la página principal
     const mesaSeleccionada = sessionStorage.getItem('mesaSeleccionada');
    const capacidadMesa = sessionStorage.getItem('capacidadMesa');

    if (mesaSeleccionada) {
      document.getElementById("formContainer").style.display = "block";
      document.getElementById("idMesaAsignada").value = mesaSeleccionada;

      // Asignar capacidad al campo de número de personas
      if (capacidadMesa) {
        document.getElementById("numeroPersonas").value = capacidadMesa;
      }

      sessionStorage.removeItem('mesaSeleccionada');
      sessionStorage.removeItem('capacidadMesa');
    }


    // Agregar evento change para cambiar color
    selector.addEventListener('change', function () {
      // Remover clase anterior
      this.className = this.className.replace(/mesa-seleccionada/g, '');
      if (this.value) {
        this.className += ' mesa-seleccionada';
      }
    });
  }

  function pintarReservas() {
    const lista = document.getElementById("listaReservas");
    lista.innerHTML = "";
    const reservas = obtenerReservas();

    if (reservas.length === 0) {
      lista.innerHTML =
        "<p class='text-center'>No hay reservas registradas.</p>";
      return;
    }

    reservas.forEach((reserva) => {
      const card = document.createElement("div");
      card.classList.add("card", "mb-3");

      // Color de borde según estado
      let borderColor = "#dee2e6";
      if (reserva.estado === "Confirmada") borderColor = "#28a745";
      else if (reserva.estado === "Pendiente") borderColor = "#ffc107";
      else if (reserva.estado === "Cancelada") borderColor = "#dc3545";
      else if (reserva.estado === "Finalizada") borderColor = "#6c757d";

      card.style.borderLeft = `4px solid ${borderColor}`;

      card.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">Reserva ID: ${reserva.idReserva.slice(0, 8)}...</h5>
              <div class="row">
                <div class="col-md-6">
                  <p class="card-text"><strong>Cliente:</strong> ${reserva.nombreCliente}</p>
                  <p class="card-text"><strong>Personas:</strong> ${reserva.numeroPersonas}</p>
                  <p class="card-text"><strong>Fecha:</strong> ${reserva.fechaReserva}</p>
                  <p class="card-text"><strong>Hora:</strong> ${reserva.horaReserva}</p>
                </div>
                <div class="col-md-6">
                  <p class="card-text"><strong>Ocasión Especial:</strong> ${reserva.ocasionEspecial || "N/A"}</p>
                  <p class="card-text"><strong>Notas:</strong> ${reserva.notasAdicionales || "N/A"}</p>
                  <p class="card-text"><strong>Mesa Asignada:</strong> ${reserva.idMesaAsignada}</p>
                  <p class="card-text"><strong>Estado:</strong> 
                    <span class="badge" style="background-color: ${borderColor}">${reserva.estado}</span>
                  </p>
                </div>
              </div>
              <div class="mt-3 botones-reserva">
                <button class="btn btn-warning btn-sm btn-editar-reserva" data-id="${reserva.idReserva}">
                  Editar
                </button>
                <button class="btn btn-danger btn-sm btn-eliminar-reserva" data-id="${reserva.idReserva}">
                  Eliminar
                </button>
                ${reserva.estado !== 'Finalizada' && reserva.estado !== 'Cancelada' ?
          `<button class="btn btn-success btn-sm btn-pagar-factura" data-id="${reserva.idReserva}">
                     Pagar Factura
                   </button>` : ''}
              </div>
            </div>
          `;
      lista.appendChild(card);
    });

    // Event listeners para los nuevos botones
    document.querySelectorAll('.btn-eliminar-reserva').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idReserva = e.target.getAttribute('data-id');

        Swal.fire({
          title: '¿Eliminar reserva?',
          text: "La mesa quedará disponible nuevamente",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            if (eliminarReserva(idReserva)) {
              pintarReservas();
              Swal.fire('Eliminada!', 'La reserva ha sido eliminada y la mesa está disponible.', 'success');
            }
          }
        });
      });
    });

    document.querySelectorAll('.btn-pagar-factura').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idReserva = e.target.getAttribute('data-id');

        Swal.fire({
          title: 'Procesar pago',
          text: "¿Confirmar el pago de la factura?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Confirmar pago',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            if (pagarFactura(idReserva)) {
              pintarReservas();
              Swal.fire({
                title: '¡Pago procesado!',
                text: 'La mesa está ahora disponible para nuevas reservas',
                icon: 'success',
                timer: 2000
              });
            }
          }
        });
      });
    });

    // Botón editar (funcionalidad básica por ahora)
    document.querySelectorAll('.btn-editar-reserva').forEach(btn => {
      btn.addEventListener('click', (e) => {
        Swal.fire({
          title: 'Función en desarrollo',
          text: 'La edición de reservas estará disponible pronto',
          icon: 'info'
        });
      });
    });
  }

  document.getElementById("btnNuevaReserva").addEventListener("click", () => {
    document.getElementById("formContainer").style.display = "block";
    cargarSelectorMesas(); // Cargar mesas disponibles
  });

  document.getElementById("formReserva").addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreCliente = document.getElementById("nombreCliente").value.trim();
     const apellidoCliente = document.getElementById("apellidoCliente").value.trim();
    const numeroPersonas = document
      .getElementById("numeroPersonas")
      .value.trim();
    const fechaReserva = document.getElementById("fechaReserva").value.trim();
    const horaReserva = document.getElementById("horaReserva").value.trim();
    const ocasionEspecial = document
      .getElementById("ocasionEspecial")
      .value.trim();
    const notasAdicionales = document
      .getElementById("notasAdicionales")
      .value.trim();
    const idMesaAsignada = document
      .getElementById("idMesaAsignada")
      .value.trim();
    const estado = document.getElementById("estado").value.trim();

    if (!nombreCliente) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar el nombre con el que quiere registrar la reserva",
      });
      return;
    }
    if (!apellidoCliente) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar el apellido ",
      });
      return;
    }
    if (
      !numeroPersonas ||
      isNaN(numeroPersonas) ||
      parseInt(numeroPersonas) <= 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar un número válido de personas",
      });
      return;
    }
    if (!fechaReserva) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar la fecha de la reserva",
      });
      return;
    }
    if (!horaReserva) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar la hora de la reserva",
      });
      return;
    }
    if (!idMesaAsignada) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes seleccionar una mesa",
      });
      return;
    }
    if (!estado) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes seleccionar el estado de la reserva",
      });
      return;
    }
    

    const [hora, minutos] = horaReserva.split(":").map(Number);
    if (hora < 8 || hora > 20 || (hora === 20 && minutos > 0)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La hora debe estar entre 08:00 y 20:00",
      });
      return;
    }

    const reservas = obtenerReservas();
    const reservaSolapada = reservas.find(
      (r) =>
        r.idMesaAsignada === idMesaAsignada &&
        r.fechaReserva === fechaReserva &&
        r.horaReserva === horaReserva &&
        r.estado !== "Cancelada" &&
        r.estado !== "Finalizada"
    );
    if (reservaSolapada) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La mesa ya está ocupada en esa fecha y hora",
      });
      return;
    }

    const nuevaReserva = {
      idReserva: crypto.randomUUID(),
      nombreCliente,
      numeroPersonas: parseInt(numeroPersonas),
      fechaReserva,
      horaReserva,
      ocasionEspecial,
      notasAdicionales,
      idMesaAsignada,
      estado,
    };

    guardarReserva(nuevaReserva);

    Swal.fire({
      icon: "success",
      title: "¡Reserva guardada!",
      text: "La reserva fue registrada correctamente y la mesa está ocupada",
    });

    document.getElementById("formReserva").reset();
    document.getElementById("formContainer").style.display = "none";

    pintarReservas();
  });

  pintarReservas();

  // 🔹 NUEVO: si hay mesa seleccionada desde mesas.js, abrir formulario automáticamente
  const mesaSeleccionada = sessionStorage.getItem('mesaSeleccionada');
  if (mesaSeleccionada) {
    document.getElementById("formContainer").style.display = "block";
    cargarSelectorMesas();
    document.getElementById("idMesaAsignada").value = mesaSeleccionada;
    sessionStorage.removeItem('mesaSeleccionada');
  }
});

