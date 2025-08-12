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

 
  document.getElementById("btnNuevaReserva").addEventListener("click", () => {
    document.getElementById("formContainer").style.display = "block";
  });


  document.getElementById("formReserva").addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevaReserva = {
      idReserva: crypto.randomUUID(),
      nombreCliente: document.getElementById("nombreCliente").value.trim(),
      numeroPersonas: parseInt(document.getElementById("numeroPersonas").value),
      fechaReserva: document.getElementById("fechaReserva").value,
      horaReserva: document.getElementById("horaReserva").value,
      ocasionEspecial: document.getElementById("ocasionEspecial").value.trim(),
      notasAdicionales: document.getElementById("notasAdicionales").value.trim(),
      idMesaAsignada: document.getElementById("idMesaAsignada").value.trim(),
      estado: document.getElementById("estado").value
    };

    guardarReserva(nuevaReserva);
    alert("Reserva guardada correctamente");

    document.getElementById("formReserva").reset();
    document.getElementById("formContainer").style.display = "none";
  });
});
