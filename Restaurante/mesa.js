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

  function obtenerMesas() {
    const mesasGuardadas = localStorage.getItem(STORAGE_KEY);
    return mesasGuardadas ? JSON.parse(mesasGuardadas) : [];
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

    mesas.forEach((mesa) => {
      const card = document.createElement('div');
      card.classList.add('mesa-card');
      const estadoClass = mesa.estado.toLowerCase() === "disponible" ? "estado-disponible" : "estado-otro";

      card.innerHTML = `
        <h4>Mesa ${mesa.numero}</h4>
        <p>Capacidad: ${mesa.capacidad} personas</p>
        <p>Ubicación: ${mesa.lugar}</p>
        <p class="${estadoClass}">${mesa.estado}</p>
      `;
      lista.appendChild(card);
    });
  }

  const miModalEl = document.getElementById('miModal');
  let modalInstance = null;

  document.getElementById("btnAgregar").addEventListener("click", () => {
    if (!modalInstance) modalInstance = new bootstrap.Modal(miModalEl);
    modalInstance.show();
  });

  document.getElementById("btnReservas").addEventListener("click", () => {
    window.location.href = "reservas.html"; // abre la página reservas.html
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
    if (mesas.some(m => m.numero === numero)) {
      Swal.fire({ icon: "warning", title: "Mesa ya registrada", text: `La mesa ${numero} ya existe` });
      return;
    }

    guardarMesa({ numero, capacidad, lugar, estado });

    Swal.fire("Éxito", "Mesa guardada correctamente", "success");

    document.getElementById("numero").value = "";
    document.getElementById("capaMesa").value = "";
    document.getElementById("lugarMesa").value = "";
    document.getElementById("estadoMesa").value = "Disponible";

    pintarMesas();

    if (modalInstance) modalInstance.hide();
  });

  pintarMesas();
});


