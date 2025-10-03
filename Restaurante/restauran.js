document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = "mesas_restaurante_v2";

  // Obtener mesas desde localStorage
  function obtenerMesas() {
    const mesasGuardadas = localStorage.getItem(STORAGE_KEY);
    return mesasGuardadas ? JSON.parse(mesasGuardadas) : [];
  }

  // Guardar mesas en localStorage
  function guardarMesas(mesas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
  }

  document.getElementById('reservas').addEventListener('click', () =>{
    window.location.href ='reservas.html';
  });

  // Pintar mesas en cards
  function pintarMesas() {
    const contenedor = document.getElementById('mesasContainer');
    contenedor.innerHTML = "";

    const mesas = obtenerMesas();
    if (mesas.length === 0) {
      contenedor.innerHTML = "<p class='text-center'>No hay mesas registradas.</p>";
      return;
    }

    mesas.forEach((mesa, index) => {
      const card = document.createElement('div');
      card.classList.add('mesa-card', 'mb-3', 'p-3', 'border');

      let estadoClass = "estado-disponible";
      if (mesa.estado.toLowerCase() === "ocupada") {
        estadoClass = "estado-ocupada";
      } else if (mesa.estado.toLowerCase() === "deshabilitada") {
        estadoClass = "estado-deshabilitada";
      }

      card.innerHTML = `
        <h4>Mesa ${mesa.numero}</h4>
        <p>Capacidad: ${mesa.capacidad} personas</p>
        <p>Ubicación: ${mesa.lugar}</p>
        <p class="${estadoClass}">${mesa.estado}</p>
        <div class="botones-mesa">
          <button  class="btn btn-success btn-sm btn-reservar" 
                  data-mesa="${mesa.numero}" 
                  data-capacidad="${mesa.capacidad}" 
                  ${mesa.estado.toLowerCase() !== 'disponible' ? 'disabled' : ''}>
            Reservar
          </button>
          <button class="btn btn-warning btn-sm btn-editar" data-index="${index}">Editar</button>
          <button class="btn btn-danger btn-sm btn-eliminar" data-index="${index}">Eliminar</button>
        </div>
      `;

      contenedor.appendChild(card);

      // ✅ Listener Reservar
      const reservarBtn = card.querySelector('.btn-reservar');
      if (reservarBtn) {
        reservarBtn.addEventListener('click', function () {
          const numeroMesa = this.getAttribute('data-mesa');
          const capacidadMesa = this.getAttribute('data-capacidad');

          sessionStorage.setItem('mesaSeleccionada', numeroMesa);
          sessionStorage.setItem('capacidadMesa', capacidadMesa);
          sessionStorage.setItem('abrirFormularioReserva', 'true');

          window.location.href = "reservas.html"; 
        });
      }
    });

    // Editar mesa
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', e => {
        const index = e.target.getAttribute('data-index');
        const mesas = obtenerMesas();
        const mesa = mesas[index];

        document.getElementById('capMesa').value = mesa.capacidad;
        document.getElementById('lugarMesa').value = mesa.lugar;

        const estadoSelect = document.getElementById('estadoMesa');
        estadoSelect.innerHTML = `
          <option value="Disponible">Disponible</option>
          <option value="Ocupada">Ocupada</option>
          <option value="Deshabilitada">Deshabilitada</option>
        `;
        estadoSelect.value = mesa.estado;

        document.getElementById('btnGuardar').setAttribute('data-edit-index', index);

        const modal = new bootstrap.Modal(document.getElementById('modalMesa'));
        modal.show();
      });
    });

    // Eliminar mesa
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', e => {
        const index = e.target.getAttribute('data-index');
        const mesas = obtenerMesas();

        Swal.fire({
          title: `¿Eliminar la mesa ${mesas[index].numero}?`,
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, eliminar"
        }).then(result => {
          if (result.isConfirmed) {
            mesas.splice(index, 1);
            guardarMesas(mesas);
            pintarMesas();
            Swal.fire("Eliminado", "La mesa ha sido eliminada.", "success");
          }
        });
      });
    });
  }

  // Guardar mesa (nueva o editada)
  document.getElementById('btnGuardar').addEventListener('click', () => {
    const capacidad = document.getElementById('capMesa').value.trim();
    const lugar = document.getElementById('lugarMesa').value.trim();
    const estado = document.getElementById('estadoMesa').value.trim();
    const editIndex = document.getElementById('btnGuardar').getAttribute('data-edit-index');

    if (!capacidad) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar la capacidad de la mesa" });
      return;
    }
    if (!lugar) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar la ubicación de la mesa" });
      return;
    }

    const mesas = obtenerMesas();

    if (editIndex !== null && editIndex !== "") {
      mesas[editIndex].capacidad = capacidad;
      mesas[editIndex].lugar = lugar;
      mesas[editIndex].estado = estado;
      guardarMesas(mesas);
      Swal.fire("Actualizado", "Mesa actualizada correctamente", "success");
    } else {
      const numero = mesas.length > 0 ? Math.max(...mesas.map(m => m.numero)) + 1 : 1;
      mesas.push({ numero, capacidad, lugar, estado });
      guardarMesas(mesas);
      Swal.fire("Éxito", `Mesa ${numero} guardada correctamente`, "success");
    }

    // limpiar formulario
    document.getElementById('capMesa').value = "";
    document.getElementById('lugarMesa').value = "";
    const estadoSelect = document.getElementById('estadoMesa');
    estadoSelect.innerHTML = `<option value="Disponible">Disponible</option>`;
    estadoSelect.value = "Disponible";
    document.getElementById('btnGuardar').removeAttribute('data-edit-index');

    pintarMesas();

    const modalEl = document.getElementById('modalMesa');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
  });

  pintarMesas();
});



