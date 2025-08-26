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
    const mesas = obtenerMesas();
    selector.innerHTML =
      '<option value="" disabled selected>Selecciona una mesa disponible</option>';
    const mesasDisponibles = mesas.filter(
      (mesa) => mesa.estado === "Disponible"
    );

    mesasDisponibles.forEach((mesa) => {
      const option = document.createElement("option");
      option.value = mesa.numero;
      option.textContent = `Mesa ${mesa.numero} - ${mesa.capacidad} personas - ${mesa.lugar}`;
      selector.appendChild(option);
    });
  }

  const imagenesOcasiones = {
    Cumpleaños: "./img/cumpleaños.jpg",
    Aniversario: "./img/aniversario.jpg",
    "Reunión de Negocios": "./img/negocios.jpg",
    "Cena Romántica": "./img/cena_romantica.jpg",
    Graduación: "./img/graduacion.jpg",
    Bautizo: "./img/bautizo.jpg",
    Boda: "./img/boda.jpg",
  };

  // 🔹imagen//
  function obtenerImagenOcasion(ocasion) {
    const ruta = imagenesOcasiones[ocasion] || "img/default.png";
    return `<img src="${ruta}" alt="${ocasion}" 
                 style="width:100px;height:60px;object-fit:cover;border-radius:5px;"
                 onerror="this.onerror=null;this.src='img/default.png';">`;
  }

  function pintarReservas(filtroFecha = "", filtroEstado = "") {
    const lista = document.getElementById("listaReservas");
    lista.innerHTML = "";
    let reservas = obtenerReservas();

    if (filtroFecha)
      reservas = reservas.filter((r) => r.fechaReserva === filtroFecha);
    if (filtroEstado)
      reservas = reservas.filter((r) => r.estado === filtroEstado);

    if (reservas.length === 0) {
      lista.innerHTML =
        "<p class='text-center'>No hay reservas registradas.</p>";
      return;
    }

    reservas.forEach((reserva) => {
      const card = document.createElement("div");
      card.classList.add("card", "mb-3");

      let borderColor = "#dee2e6";
      if (reserva.estado === "Confirmada") borderColor = "#28a745";
      else if (reserva.estado === "Pendiente") borderColor = "#ffc107";
      else if (reserva.estado === "Cancelada") borderColor = "#dc3545";
      else if (reserva.estado === "Finalizada") borderColor = "#6c757d";

      card.style.borderLeft = `4px solid ${borderColor}`;

   let ocasionHTML = "";
if (reserva.ocasionEspecial) {
  const nombreImagen =
    imagenesOcasiones[reserva.ocasionEspecial]?.split("/").pop() || "default.png";

  ocasionHTML = `
    <div class="ocasion-especial-container text-center mb-3">
      <h5 class="ocasion-titulo">${reserva.ocasionEspecial}</h5>
      <img src="img/${nombreImagen}" alt="${reserva.ocasionEspecial}"
           onerror="this.onerror=null;this.src='img/default.png';"
           class="img-ocasion">
    </div>
  `;
}


      let notasHTML = reserva.notasAdicionales
        ? `<p class="card-text"><strong>Notas:</strong> ${reserva.notasAdicionales}</p>`
        : "";

      card.innerHTML = `
  <div class="card-body">
    <h5 class="card-title">Número de reserva: ${reserva.idReserva.slice(0, 5)}...</h5>
    ${ocasionHTML}
    <div class="row">
      <div class="col-md-6">
      <p class="card-text1"><strong>Mesa Asignada:</strong> ${reserva.idMesaAsignada}</p>
        <p class="card-text2"><strong>Cliente:</strong> ${reserva.nombreCliente} ${reserva.apellidoCliente || ""}</p>
        <p class="card-text3"><strong>Personas:</strong> ${reserva.numeroPersonas}</p>
        <p class="card-text4"><strong>Fecha:</strong> ${reserva.fechaReserva}</p>
        <p class="card-text5"><strong>Hora:</strong> ${reserva.horaReserva}</p>
        <p class="card-text7"><strong>Ocasión Especial:</strong> ${reserva.ocasionEspecial || "Ninguna"}</p>
      </div>
      <div class="col-md-6">
        ${notasHTML}
        <p class="card-text6"><strong>Estado:</strong> 
          <span class="badge" style="background-color: ${borderColor}">${reserva.estado}</span>
        </p>
      </div>
    </div>
    <div class="mt-3 botones-reserva">
      <button class="btn btn-warning btn-sm btn-editar-reserva" data-id="${reserva.idReserva}">Editar</button>
      <button class="btn btn-danger btn-sm btn-eliminar-reserva" data-id="${reserva.idReserva}">Eliminar</button>
      ${
        reserva.estado !== "Finalizada" && reserva.estado !== "Cancelada"
          ? `<button class="btn btn-success btn-sm btn-pagar-factura" data-id="${reserva.idReserva}">Pagar Factura</button>`
          : ""
      }
    </div>
  </div>
`;

      lista.appendChild(card);
    });

    // Eliminar
    document.querySelectorAll(".btn-eliminar-reserva").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idReserva = e.target.getAttribute("data-id");
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
              pintarReservas(filtroFecha, filtroEstado);
              Swal.fire(
                "Eliminada!",
                "La reserva ha sido eliminada y la mesa está disponible.",
                "success"
              );
            }
          }
        });
      });
    });

    // Pagar
    document.querySelectorAll(".btn-pagar-factura").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idReserva = e.target.getAttribute("data-id");
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
              pintarReservas(filtroFecha, filtroEstado);
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
  }
  //editar//
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-editar-reserva")) {
      const idReserva = e.target.getAttribute("data-id");
      const reservas = obtenerReservas();
      const reserva = reservas.find((r) => r.idReserva === idReserva);

      if (!reserva) return;

      document.getElementById("nombreCliente").value = reserva.nombreCliente;
      document.getElementById("apellidoCliente").value =
        reserva.apellidoCliente;
      document.getElementById("numeroPersonas").value = reserva.numeroPersonas;
      document.getElementById("fechaReserva").value = reserva.fechaReserva;
      document.getElementById("horaReserva").value = reserva.horaReserva;
      document.getElementById("ocasionEspecial").value =
        reserva.ocasionEspecial || "";
      document.getElementById("notasAdicionales").value =
        reserva.notasAdicionales || "";
    
      document.getElementById("estado").value = reserva.estado;

      document
        .getElementById("formReserva")
        .setAttribute("data-edit-id", idReserva);

      document.getElementById("formContainer").style.display = "block";
    }
  });
  function editarReserva(idReserva, nuevosDatos) {
    const reservas = obtenerReservas();
    const index = reservas.findIndex((r) => r.idReserva === idReserva);
    if (index === -1) return false;

    const mesaAnterior = reservas[index].idMesaAsignada;
    reservas[index] = { ...reservas[index], ...nuevosDatos };

    if (mesaAnterior !== nuevosDatos.idMesaAsignada) {
      actualizarEstadoMesa(mesaAnterior, "Disponible");
      actualizarEstadoMesa(nuevosDatos.idMesaAsignada, "Ocupada");
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
    return true;
  }

  document.getElementById("btnNuevaReserva").addEventListener("click", () => {
    document.getElementById("formContainer").style.display = "block";
    cargarSelectorMesas();
  });

  //abrir formulario //
  const mesaSeleccionada = sessionStorage.getItem("mesaSeleccionada");
  const capacidadMesa = sessionStorage.getItem("capacidadMesa");
  const abrirFormulario = sessionStorage.getItem("abrirFormularioReserva");

  if (abrirFormulario && mesaSeleccionada) {
    document.getElementById("formContainer").style.display = "block";
    cargarSelectorMesas();
    document.getElementById("idMesaAsignada").value = mesaSeleccionada;
    if (capacidadMesa) {
      document.getElementById("numeroPersonas").value = capacidadMesa;
    }
    sessionStorage.removeItem("abrirFormularioReserva");
  }

  document.getElementById("formReserva").addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreCliente = document.getElementById("nombreCliente").value.trim();
    const apellidoCliente = document
      .getElementById("apellidoCliente")
      .value.trim();
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
        text: "Debes ingresar el nombre",
      });
      return;
    }
    if (!apellidoCliente) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar el apellido",
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
        text: "Número de personas inválido",
      });
      return;
    }

    const hoy = new Date().toISOString().split("T")[0];
    if (!fechaReserva || fechaReserva < hoy) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La fecha debe ser igual o posterior a hoy",
      });
      return;
    }

    if (!horaReserva) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar la hora",
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
        text: "Debes seleccionar el estado",
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
      apellidoCliente,
      numeroPersonas: parseInt(numeroPersonas),
      fechaReserva,
      horaReserva,
      ocasionEspecial: ocasionEspecial || "",
      notasAdicionales: notasAdicionales || "",
      idMesaAsignada,
      estado,
    };

    guardarReserva(nuevaReserva);

    Swal.fire({
      icon: "success",
      title: "¡Reserva guardada!",
      text: "La mesa está ocupada",
    });
    document.getElementById("formReserva").reset();
    document.getElementById("formContainer").style.display = "none";
    pintarReservas();
  });

  //filtro//
  const filtroFechaInput = document.getElementById("filtroFecha");
  const filtroEstadoSelect = document.getElementById("filtroEstado");
  if (filtroFechaInput && filtroEstadoSelect) {
    filtroFechaInput.addEventListener("change", () => {
      pintarReservas(filtroFechaInput.value, filtroEstadoSelect.value);
    });
    filtroEstadoSelect.addEventListener("change", () => {
      pintarReservas(filtroFechaInput.value, filtroEstadoSelect.value);
    });
  }

  pintarReservas();
});
