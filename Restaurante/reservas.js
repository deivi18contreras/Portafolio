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

  function obtenerSiguienteId() {
    const reservas = obtenerReservas();
    if (reservas.length == 1000) {
    
    }
    const ultimoId = Math.max(...reservas.map(r => parseInt(r.idReserva, 10)));
    return ultimoId + 1;
  }

  function actualizarEstadoMesa(numeroMesa, nuevoEstado) {
    const mesas = obtenerMesas();
    const mesaIndex = mesas.findIndex((m) => m.numero === numeroMesa);
    if (mesaIndex !== -1) {
      mesas[mesaIndex].estado = nuevoEstado;
      localStorage.setItem(MESAS_KEY, JSON.stringify(mesas));
    }
  }

  function guardarReserva(reserva) {
    const reservas = obtenerReservas();
    reservas.push(reserva);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
    actualizarEstadoMesa(reserva.idMesaAsignada, "Ocupada");
  }

  function eliminarReserva(idReserva) {
    const reservas = obtenerReservas();
    const reservaIndex = reservas.findIndex((r) => r.idReserva === idReserva);
    if (reservaIndex !== -1) {
      const numeroMesa = reservas[reservaIndex].idMesaAsignada;
      reservas.splice(reservaIndex, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
      actualizarEstadoMesa(numeroMesa, "Disponible");
      return true;
    }
    return false;
  }

  function pagarFactura(idReserva) {
    const reservas = obtenerReservas();
    const reservaIndex = reservas.findIndex((r) => r.idReserva === idReserva);
    if (reservaIndex !== -1) {
      const numeroMesa = reservas[reservaIndex].idMesaAsignada;
      reservas[reservaIndex].estado = "Finalizada";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
      actualizarEstadoMesa(numeroMesa, "Disponible");
      return true;
    }
    return false;
  }

  function cargarSelectorMesas() {
    const selector = document.getElementById("idMesaAsignada");
    if (!selector) return;
    selector.innerHTML =
      '<option value="" disabled selected>Selecciona una mesa disponible</option>';
    const mesas = obtenerMesas();
    const mesasDisponibles = mesas.filter(m => m.estado === "Disponible");
    mesasDisponibles.forEach(mesa => {
      const option = document.createElement("option");
      option.value = mesa.numero;
      option.textContent = `Mesa ${mesa.numero} - ${mesa.capacidad} personas - ${mesa.lugar}`;
      selector.appendChild(option);
    });
  }

  const imagenesOcasiones = {
    "Aniversario": "./img/aniversario.jpg",
    "Bautizo": "./img/bautizo.jpg",
    "Boda": "./img/boda.jpg",
    "Cena Romántica": "./img/cena_romantica.jpg",
    "Cumpleaños": "./img/cumpleaños.jpg",
    "Graduación": "./img/graduacion.jpg",
    "Reunión de Negocios": "./img/negocios.jpg",

  };

  function pintarReservas(filtroFecha = "", filtroEstado = "") {
    const lista = document.getElementById("listaReservas");
    if (!lista) return;
    lista.innerHTML = "";
    let reservas = obtenerReservas();

    if (filtroFecha) reservas = reservas.filter(r => r.fechaReserva === filtroFecha);
    if (filtroEstado) reservas = reservas.filter(r => r.estado === filtroEstado);

    if (reservas.length === 0) {
      lista.innerHTML = "<p class='text-center'>No hay reservas registradas.</p>";
      return;
    }

    reservas.forEach(reserva => {
      const card = document.createElement("div");
      card.classList.add("card", "mb-3", "p-3");

      let bgColor = "#f8f9fa";
      if (reserva.estado === "Confirmada") bgColor = "#27a143ff";
      else if (reserva.estado === "Pendiente") bgColor = "#b9b721ff";
      else if (reserva.estado === "Cancelada") bgColor = "#751a21ff";
      else if (reserva.estado === "Finalizada") bgColor = "#e2e3e5";

      card.style.backgroundColor = bgColor;

      let ocasionHTML = "";
      if (reserva.ocasionEspecial) {
        const rutaImagen = imagenesOcasiones[reserva.ocasionEspecial] || "./img/default.png";
        ocasionHTML = `
          <div class="ocasion-especial-container text-center mb-3">
            <h5 class="ocasion-titulo">${reserva.ocasionEspecial}</h5>
            <img src="${rutaImagen}" alt="${reserva.ocasionEspecial}"
                 onerror="this.onerror=null;this.src='./img/default.png';"
                 class="img-ocasion" style="max-width:100%; height:auto;">
          </div>
        `;
      }

      let notasHTML = reserva.notasAdicionales
        ? `<p class="card-text"><strong>Notas:</strong> ${reserva.notasAdicionales}</p>`
        : "";

      card.innerHTML = `
        <div class="card-body">
          ${ocasionHTML}
          <h5 class="card-title">Número de reserva: ${reserva.idReserva}</h5>
          <div class="row">
            <div class="col-md-6">
              <p><strong>Mesa Asignada:</strong> ${reserva.idMesaAsignada}</p>
              <p><strong>Cliente:</strong> ${reserva.nombreCliente} ${reserva.apellidoCliente || ""}</p>
              <p><strong>Personas:</strong> ${reserva.numeroPersonas}</p>
              <p><strong>Fecha:</strong> ${reserva.fechaReserva}</p>
              <p><strong>Hora:</strong> ${reserva.horaReserva}</p>
              <p><strong>Ocasión Especial:</strong> ${reserva.ocasionEspecial || "Ninguna"}</p>
            </div>
            <div class="col-md-6">
              ${notasHTML}
              <p><strong>Estado:</strong> <span class="badge bg-dark">${reserva.estado}</span></p>
            </div>
          </div>
          <div class="mt-3 botones-reserva">
            <button class="btn btn-warning btn-sm btn-editar-reserva" data-id="${reserva.idReserva}">Editar</button>
            <button class="btn btn-danger btn-sm btn-eliminar-reserva" data-id="${reserva.idReserva}">Eliminar</button>
            ${reserva.estado !== "Finalizada" && reserva.estado !== "Cancelada"
          ? `<button class="btn btn-success btn-sm btn-pagar-factura" data-id="${reserva.idReserva}">Pagar Factura</button>`
          : ""
        }
          </div>
        </div>
      `;
      lista.appendChild(card);
    });

    attachListeners();
  }

  function attachListeners() {
    // Eliminar
    document.querySelectorAll(".btn-eliminar-reserva").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idReserva = parseInt(e.target.getAttribute("data-id"), 10);
        Swal.fire({
          title: "¿Eliminar reserva?",
          text: "La mesa quedará disponible nuevamente",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            if (eliminarReserva(idReserva)) {
              pintarReservas();
              Swal.fire("Eliminada!", "La reserva ha sido eliminada y la mesa está disponible.", "success");
            }
          }
        });
      });
    });

    // Pagar factura
    document.querySelectorAll(".btn-pagar-factura").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idReserva = parseInt(e.target.getAttribute("data-id"), 10);
        Swal.fire({
          title: "Procesar pago",
          text: "¿Confirmar el pago de la factura?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Confirmar pago",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            if (pagarFactura(idReserva)) {
              pintarReservas();
              Swal.fire({
                title: "¡Pago procesado!",
                text: "La mesa está ahora disponible",
                icon: "success",
                timer: 2000,
              });
            }
          }
        });
      });
    });

    // Editar
    document.querySelectorAll(".btn-editar-reserva").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idReserva = parseInt(e.target.getAttribute("data-id"), 10);
        const reservas = obtenerReservas();
        const reserva = reservas.find(r => r.idReserva === idReserva);
        if (!reserva) return;

        const modalForm = new bootstrap.Modal(document.getElementById('formModal'));
        modalForm.show();

        cargarSelectorMesas();
        const selectorMesa = document.getElementById("idMesaAsignada");
        if (selectorMesa) {
          let existe = Array.from(selectorMesa.options).some(opt => opt.value == reserva.idMesaAsignada);
          if (!existe) {
            const option = document.createElement("option");
            option.value = reserva.idMesaAsignada;
            option.textContent = `Mesa ${reserva.idMesaAsignada} (actual)`;
            selectorMesa.appendChild(option);
          }
          selectorMesa.value = reserva.idMesaAsignada;
          selectorMesa.disabled = true;
        }

        const nombreInput = document.getElementById("nombreCliente");
        const apellidoInput = document.getElementById("apellidoCliente");
        const numeroPersonasInput = document.getElementById("numeroPersonas");
        const fechaInput = document.getElementById("fechaReserva");
        const horaInput = document.getElementById("horaReserva");
        const ocasionInput = document.getElementById("ocasionEspecial");
        const notasInput = document.getElementById("notasAdicionales");
        const estadoInput = document.getElementById("estado");

        if (nombreInput) nombreInput.value = reserva.nombreCliente;
        if (apellidoInput) apellidoInput.value = reserva.apellidoCliente;
        if (numeroPersonasInput) numeroPersonasInput.value = reserva.numeroPersonas;
        if (fechaInput) fechaInput.value = reserva.fechaReserva;
        if (horaInput) horaInput.value = reserva.horaReserva;
        if (ocasionInput) ocasionInput.value = reserva.ocasionEspecial || "";
        if (notasInput) notasInput.value = reserva.notasAdicionales || "";
        if (estadoInput) estadoInput.value = reserva.estado;

        const form = document.getElementById("formReserva");
        if (form) {
          form.setAttribute("data-edit-id", idReserva);
        }
      });
    });
  }

  // Si vienes con mesa seleccionada de otra pantalla/modal (opcional)
  const abrir = sessionStorage.getItem('abrirFormularioReserva');
  const mesaSeleccionada = sessionStorage.getItem('mesaSeleccionada');
  const capacidadMesa = sessionStorage.getItem('capacidadMesa');

  if (abrir === 'true') {
    const modalForm = document.getElementById('formModal');
    if (modalForm) {
      const bsModal = new bootstrap.Modal(modalForm);
      bsModal.show();
    }

    cargarSelectorMesas();

    if (mesaSeleccionada) {
      const selector = document.getElementById("idMesaAsignada");
      if (selector) {
        let existe = Array.from(selector.options).some(opt => opt.value == mesaSeleccionada);
        if (!existe) {
          const option = document.createElement("option");
          option.value = mesaSeleccionada;
          option.textContent = `Mesa ${mesaSeleccionada} (seleccionada)`;
          selector.appendChild(option);
        }
        selector.value = mesaSeleccionada;
      }
    }
    if (capacidadMesa) {
      const numeroPersonasInput = document.getElementById("numeroPersonas");
      if (numeroPersonasInput) {
        numeroPersonasInput.value = capacidadMesa;
      }
    }

    sessionStorage.removeItem('abrirFormularioReserva');
  }

  function cerrarYLimpioFormulario() {
    const form = document.getElementById("formReserva");
    if (form) {
      form.reset();
      form.removeAttribute("data-edit-id");
    }
    const selectorMesa = document.getElementById("idMesaAsignada");
    if (selectorMesa) {
      selectorMesa.disabled = false;
    }
    const modalEl = document.getElementById('formModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
    }
  }

  // Agregar listener al formulario de reserva
  const formReserva = document.getElementById("formReserva");
  if (formReserva) {
    formReserva.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombreClienteInput = document.getElementById("nombreCliente");
      const apellidoClienteInput = document.getElementById("apellidoCliente");
      const numeroPersonasInput = document.getElementById("numeroPersonas");
      const fechaReservaInput = document.getElementById("fechaReserva");
      const horaReservaInput = document.getElementById("horaReserva");
      const ocasionEspecialInput = document.getElementById("ocasionEspecial");
      const notasAdicionalesInput = document.getElementById("notasAdicionales");
      const idMesaAsignadaInput = document.getElementById("idMesaAsignada");
      const estadoInput = document.getElementById("estado");

      const nombreCliente = nombreClienteInput ? nombreClienteInput.value.trim() : "";
      const apellidoCliente = apellidoClienteInput ? apellidoClienteInput.value.trim() : "";
      const numeroPersonas = numeroPersonasInput ? numeroPersonasInput.value.trim() : "";
      const fechaReserva = fechaReservaInput ? fechaReservaInput.value.trim() : "";
      const horaReserva = horaReservaInput ? horaReservaInput.value.trim() : "";
      const ocasionEspecial = ocasionEspecialInput ? ocasionEspecialInput.value.trim() : "";
      const notasAdicionales = notasAdicionalesInput ? notasAdicionalesInput.value.trim() : "";
      const idMesaAsignada = idMesaAsignadaInput ? idMesaAsignadaInput.value.trim() : "";
      const estado = estadoInput ? estadoInput.value.trim() : "";

      if (!nombreCliente) {
        Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar el nombre" });
        return;
      }
      if (!apellidoCliente) {
        Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar el apellido" });
        return;
      }
      if (!numeroPersonas || isNaN(numeroPersonas) || parseInt(numeroPersonas, 10) <= 0) {
        Swal.fire({ icon: "error", title: "Oops...", text: "Número de personas inválido" });
        return;
      }

      const hoy = new Date().toISOString().split("T")[0];
      if (!fechaReserva || fechaReserva < hoy) {
        Swal.fire({ icon: "error", title: "Oops...", text: "La fecha debe ser igual o posterior a hoy" });
        return;
      }

      if (!horaReserva) {
        Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar la hora" });
        return;
      }

      // VALIDACIÓN DE HORARIO: solo de 08:00 a 20:00 (inclusive 20:00)
      {
        const parts = horaReserva.split(":");
        let hora = 0, minuto = 0;
        if (parts.length >= 2) {
          hora = parseInt(parts[0], 10);
          minuto = parseInt(parts[1], 10);
        }
        if (isNaN(hora) || isNaN(minuto)) {
          Swal.fire({ icon: "error", title: "Oops...", text: "Hora inválida" });
          return;
        }
        if (hora < 8 || hora > 20 || (hora === 20 && minuto > 0)) {
          Swal.fire({
            icon: "error",
            title: "Horario no permitido",
            text: "Las reservas solo pueden ser entre las 08:00 y las 20:00 horas.",
          });
          return;
        }
      }

      if (!idMesaAsignada) {
        Swal.fire({ icon: "error", title: "Oops...", text: "Debes seleccionar una mesa" });
        return;
      }
      if (!estado) {
        Swal.fire({ icon: "error", title: "Oops...", text: "Debes seleccionar un estado" });
        return;
      }

      const mesas = obtenerMesas();
      const mesaSeleccionadaObj = mesas.find(m => m.numero == idMesaAsignada);
      if (mesaSeleccionadaObj && parseInt(numeroPersonas, 10) > mesaSeleccionadaObj.capacidad) {
        Swal.fire({ icon: "error", title: "Oops...", text: `La mesa seleccionada tiene capacidad para máximo ${mesaSeleccionadaObj.capacidad} personas` });
        return;
      }

      const editIdAttr = formReserva.getAttribute("data-edit-id");
      if (editIdAttr) {
        const editId = parseInt(editIdAttr, 10);
        const reservas = obtenerReservas();
        const index = reservas.findIndex(r => r.idReserva === editId);
        if (index !== -1) {
          reservas[index].nombreCliente = nombreCliente;
          reservas[index].apellidoCliente = apellidoCliente;
          reservas[index].numeroPersonas = parseInt(numeroPersonas, 10);
          reservas[index].fechaReserva = fechaReserva;
          reservas[index].horaReserva = horaReserva;
          reservas[index].ocasionEspecial = ocasionEspecial;
          reservas[index].notasAdicionales = notasAdicionales;
          reservas[index].estado = estado;

          if (reservas[index].idMesaAsignada != idMesaAsignada) {
            actualizarEstadoMesa(reservas[index].idMesaAsignada, "Disponible");
            actualizarEstadoMesa(parseInt(idMesaAsignada, 10), "Ocupada");
            reservas[index].idMesaAsignada = parseInt(idMesaAsignada, 10);
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
          Swal.fire("Actualizado!", "La reserva ha sido actualizada.", "success");
        }
      } else {
        const nuevaReserva = {
          idReserva: obtenerSiguienteId(),
          idMesaAsignada: parseInt(idMesaAsignada, 10),
          nombreCliente,
          apellidoCliente,
          numeroPersonas: parseInt(numeroPersonas, 10),
          fechaReserva,
          horaReserva,
          ocasionEspecial,
          notasAdicionales,
          estado,
        };
        guardarReserva(nuevaReserva);
        Swal.fire("¡Reserva creada!", "La reserva se ha registrado correctamente.", "success");
      }

      pintarReservas();
      cerrarYLimpioFormulario();
    });
  } else {
    console.warn("⚠️ No se encontró el elemento formReserva; no se pudo asignar el listener de submit.");
  }

  // Listener filtros
  const filtroFechaInput = document.getElementById("filtroFecha");
  if (filtroFechaInput) {
    filtroFechaInput.addEventListener("change", (e) => {
      const filtroFecha = e.target.value;
      const filtroEstadoElem = document.getElementById("filtroEstado");
      const filtroEstado = filtroEstadoElem ? filtroEstadoElem.value : "";
      pintarReservas(filtroFecha, filtroEstado);
    });
  }
  const filtroEstadoSelect = document.getElementById("filtroEstado");
  if (filtroEstadoSelect) {
    filtroEstadoSelect.addEventListener("change", (e) => {
      const filtroEstado = e.target.value;
      const filtroFechaElem = document.getElementById("filtroFecha");
      const filtroFecha = filtroFechaElem ? filtroFechaElem.value : "";
      pintarReservas(filtroFecha, filtroEstado);
    });
  }

  const btnNuevaReserva = document.getElementById("btnNuevaReserva");
  if (btnNuevaReserva) {
    btnNuevaReserva.addEventListener("click", () => {
      cargarSelectorMesas();
      cerrarYLimpioFormulario();
      const modalEl = document.getElementById('formModal');
      if (modalEl) {
        const modalForm = new bootstrap.Modal(modalEl);
        modalForm.show();
      }
    });
  }

  // Botón limpiar filtros (asumí que lo quieres)
  const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");
  if (btnLimpiarFiltros) {
    btnLimpiarFiltros.addEventListener("click", () => {
      const filtroFechaElem = document.getElementById("filtroFecha");
      const filtroEstadoElem = document.getElementById("filtroEstado");
      if (filtroFechaElem) filtroFechaElem.value = "";
      if (filtroEstadoElem) filtroEstadoElem.value = "";
      pintarReservas("", "");
    });
  }

  // Inicializar
  cargarSelectorMesas();
  pintarReservas();
});

