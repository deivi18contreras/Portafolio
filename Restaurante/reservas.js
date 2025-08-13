document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "reservas_restaurante_v1";

  function obtenerReservas() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function guardarReserva(reserva) {
    const reservas = obtenerReservas();
    reservas.push(reserva);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
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
      card.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">Reserva ID: ${reserva.idReserva}</h5>
              <p class="card-text"><strong>Cliente:</strong> ${
                reserva.nombreCliente
              }</p>
              <p class="card-text"><strong>Personas:</strong> ${
                reserva.numeroPersonas
              }</p>
              <p class="card-text"><strong>Fecha:</strong> ${
                reserva.fechaReserva
              }</p>
              <p class="card-text"><strong>Hora:</strong> ${
                reserva.horaReserva
              }</p>
              <p class="card-text"><strong>Ocasión Especial:</strong> ${
                reserva.ocasionEspecial || "N/A"
              }</p>
              <p class="card-text"><strong>Notas:</strong> ${
                reserva.notasAdicionales || "N/A"
              }</p>
              <p class="card-text"><strong>Mesa Asignada:</strong> ${
                reserva.idMesaAsignada
              }</p>
              <p class="card-text"><strong>Estado:</strong> <span class="badge bg-secondary">${
                reserva.estado
              }</span></p>
            </div>
          `;
      lista.appendChild(card);
    });
  }

  document.getElementById("btnNuevaReserva").addEventListener("click", () => {
    document.getElementById("formContainer").style = "block";
  });

  document.getElementById("formReserva").addEventListener("submit", (e) => {
    e.preventDefault();

    const nombreCliente = document.getElementById("nombreCliente").value.trim();
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
        text: "Debes ingresar el nombre del cliente",
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
        text: "Debes ingresar el ID de la mesa asignada",
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

    // Validar hora entre 08:00 y 20:00
    const [hora, minutos] = horaReserva.split(":").map(Number);
    if (hora < 8 || hora > 20 || (hora === 20 && minutos > 0)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La hora debe estar entre 08:00 y 20:00",
      });
      return;
    }

    // Validar disponibilidad de mesa
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
      text: "La reserva fue registrada correctamente",
    });

    document.getElementById("formReserva").reset();
    document.getElementById("formContainer").style.display = "none";

    pintarReservas();
  });

  pintarReservas();
});
