document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "reservas_restaurante_v2";
  const MESAS_KEY = "mesas_restaurante_v2";

  function obtenerReservas() {
    const reservasGuardadas = localStorage.getItem(STORAGE_KEY);
    return reservasGuardadas ? JSON.parse(reservasGuardadas) : [];
  }

  function guardarReserva(reservas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
  }

  function obtenerMesas() {
    const mesasGuardadas = localStorage.getItem(MESAS_KEY);
    return mesasGuardadas ? JSON.parse(mesasGuardadas) : [];
  }

  document.getElementById("volver").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  function cargarMesasDisponibles() {
    const mesas = obtenerMesas();
    const select = document.getElementById("idMesaAsignada");

    select.innerHTML = `<option value="" disabled selected>Selecciona una mesa disponible</option>`;

    const mesasDisponibles = mesas.filter((m) => m.estado === "Disponible");

    mesasDisponibles.forEach((mesa) => {
      const option = document.createElement("option");
      option.value = mesa.numero;
      option.textContent = `Mesa ${mesa.numero} - Capacidad: ${mesa.capacidad}`;
      select.appendChild(option);
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
    const contenedor = document.getElementById("contenedorReservas");
    let reservas = obtenerReservas();

    if (filtroFecha) reservas = reservas.filter((r) => r.fecha === filtroFecha);
    if (filtroEstado) reservas = reservas.filter((r) => r.estado === filtroEstado);

    if (reservas.length === 0) {
      contenedor.innerHTML = `<p class="text-muted">No hay reservas registradas</p>`;
      return;
    }

    contenedor.innerHTML = reservas.map((r, i) => {
      // Asignación de color por borde según estado
      let colorCard;
      switch(r.estado) {
          case "Confirmada":
              colorCard = "#27a143"; // verde
              break;
          case "Pendiente":
              colorCard = "#b9b721"; // amarillo
              break;
          case "Cancelada":
              colorCard = "#a33a3a"; // rojo
              break;
          case "Finalizada":
          case "No Show":
              colorCard = "#6c757d"; // gris oscuro
              break;
          default:
              colorCard = "#27a143"; // verde por defecto para reservas activas
      }

      let ocasionHTML = "";
      if (r.ocasion) {
        const rutaImagen = imagenesOcasiones[r.ocasion] || "./img/default.png";
        ocasionHTML = `
          <div class="ocasion-especial-container text-center mb-3">
            <h5 class="ocasion-titulo">${r.ocasion}</h5>
            <img src="${rutaImagen}" alt="${r.ocasion}" class="img-ocasion" style="max-width:100%; height:auto;" onerror="this.onerror=null;this.src='./img/default.png';">
          </div>
        `;
      }

      return `
      <div class="col-md-4">
        <div class="card shadow-sm ${r.pagada ? "bg-light text-muted" : ""}" style="background-color:transparent; border: 2px solid ${colorCard};">
          <div class="card-body">
            ${ocasionHTML}
            <h5 class="card-title">${r.nombre} ${r.apellido}</h5>
            <p class="card-text">
              <strong>Correo:</strong> ${r.correo} <br>
              <strong>Personas:</strong> ${r.numeroPersonas} <br>
              <strong>Fecha:</strong> ${r.fecha} <br>
              <strong>Hora:</strong> ${r.hora} <br>
              <strong>Mesa:</strong> ${r.mesa} <br>
              <strong>Estado:</strong> ${r.estado} <br>
              <em>${r.notas || ""}</em>
            </p>
            <button class="btn btn-danger btn-sm" onclick="eliminarReserva(${i})" ${r.pagada ? "disabled" : ""}>Eliminar</button>
            <button class="btn btn-warning btn-sm" onclick="editarReserva(${i})" ${r.pagada ? "disabled" : ""}>Editar</button>
            <button class="btn btn-success btn-sm" onclick="pagarReserva(${i})" ${r.pagada ? "disabled" : ""}>Pagar factura</button>
          </div>
        </div>
      </div>
      `;
    }).join("");
  }

  document.getElementById("btnGuardar").addEventListener("click", () => {
    const nombre = document.getElementById("nombreCliente").value.trim();
    const apellido = document.getElementById("apellidoCliente").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const numeroPersonas = document.getElementById("numeroPersonas").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const ocasion = document.getElementById("ocasionEspecial").value;
    const notas = document.getElementById("notasAdicionales").value.trim();
    const mesa = document.getElementById("idMesaAsignada").value;
    const estado = document.getElementById("estado").value;

    // Validaciones originales
    if (!nombre) { Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar el nombre" }); return; }
    if (!apellido) { Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar el apellido" }); return; }
    if (!correo) { Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar el correo" }); return; }
    if (!numeroPersonas || isNaN(numeroPersonas) || parseInt(numeroPersonas, 10) <= 0) { Swal.fire({ icon: "error", title: "Oops...", text: "Número de personas inválido" }); return; }
    const hoy = new Date().toISOString().split("T")[0];
    if (!fecha || fecha < hoy) { Swal.fire({ icon: "error", title: "Oops...", text: "La fecha debe ser igual o posterior a hoy" }); return; }
    if (!hora) { Swal.fire({ icon: "error", title: "Oops...", text: "Debes ingresar la hora" }); return; }
    const parts = hora.split(":"); let horas=0, minuto=0;
    if(parts.length>=2){horas=parseInt(parts[0],10); minuto=parseInt(parts[1],10);}
    if(isNaN(horas) || isNaN(minuto)){Swal.fire({icon:"error",title:"Oops...",text:"Hora inválida"});return;}
    if(horas<8 || horas>20 || (horas===20 && minuto>0)){Swal.fire({icon:"error",title:"Horario no permitido",text:"Las reservas solo pueden ser entre las 08:00 y las 20:00 horas."}); return;}
    if(!mesa){ Swal.fire({icon:"error",title:"Oops...",text:"Debes seleccionar una mesa"});return;}
    if(!estado){ Swal.fire({icon:"error",title:"Oops...",text:"Debes seleccionar un estado"});return;}
    const mesas = obtenerMesas();
    const mesaSeleccionadaObj = mesas.find((m)=>m.numero==mesa);
    if(mesaSeleccionadaObj && parseInt(numeroPersonas,10) > mesaSeleccionadaObj.capacidad){Swal.fire({icon:"error",title:"Oops...",text:`La mesa seleccionada tiene capacidad para máximo ${mesaSeleccionadaObj.capacidad} personas`}); return;}

    // Guardar reserva
    const reservas = obtenerReservas();
    reservas.push({ nombre, apellido, correo, numeroPersonas, fecha, hora, ocasion, notas, mesa, estado, pagada:false });
    guardarReserva(reservas);

    // Cambiar mesa a ocupada
    if(mesaSeleccionadaObj){mesaSeleccionadaObj.estado="Ocupada"; localStorage.setItem(MESAS_KEY,JSON.stringify(mesas));}

    pintarReservas();
    Swal.fire({ icon:"success", title:"Reserva guardada", text:"La mesa ha sido ocupada correctamente" });

    // Limpiar y cerrar modal automáticamente
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalMesa"));
    if(modal) modal.hide();
    document.getElementById("formReserva").reset();
    cargarMesasDisponibles();
  });

  window.pagarReserva = (i) => {
    const reservas = obtenerReservas();
    const reserva = reservas[i];
    const mesas = obtenerMesas();
    const mesa = mesas.find(m => String(m.numero) === String(reserva.mesa));
    if(mesa) mesa.estado="Disponible";
    localStorage.setItem(MESAS_KEY,JSON.stringify(mesas));
    reserva.pagada=true;
    reserva.estado="Finalizada";
    guardarReserva(reservas);
    Swal.fire("Éxito","La factura ha sido pagada y la mesa quedó disponible","success");
    cargarMesasDisponibles();
    pintarReservas();
  };

  window.eliminarReserva = (i) => {
    const reservas = obtenerReservas();
    const reserva = reservas[i];
    const mesas = obtenerMesas();
    const mesa = mesas.find(m=>String(m.numero)===String(reserva.mesa));
    if(mesa) mesa.estado="Disponible";
    localStorage.setItem(MESAS_KEY,JSON.stringify(mesas));
    reservas.splice(i,1);
    guardarReserva(reservas);
    Swal.fire("Eliminada","La reserva ha sido eliminada y la mesa quedó disponible","success");
    pintarReservas();
    cargarMesasDisponibles();
  };

  window.editarReserva = (i)=>{
    const reservas = obtenerReservas();
    const r = reservas[i];
    document.getElementById("nombreCliente").value=r.nombre;
    document.getElementById("apellidoCliente").value=r.apellido;
    document.getElementById("correo").value=r.correo;
    document.getElementById("numeroPersonas").value=r.numeroPersonas;
    document.getElementById("fecha").value=r.fecha;
    document.getElementById("hora").value=r.hora;
    document.getElementById("ocasionEspecial").value=r.ocasion;
    document.getElementById("notasAdicionales").value=r.notas;
    document.getElementById("idMesaAsignada").value=r.mesa;
    document.getElementById("estado").value=r.estado;
    const modal = new bootstrap.Modal(document.getElementById("modalMesa"));
    modal.show();
    reservas.splice(i,1);
    guardarReserva(reservas);
  };

  document.getElementById("filtroFecha").addEventListener("change",(e)=>pintarReservas(e.target.value,document.getElementById("filtroEstado").value));
  document.getElementById("filtroEstado").addEventListener("change",(e)=>pintarReservas(document.getElementById("filtroFecha").value,e.target.value));
  document.getElementById("btnLimpiarFiltros").addEventListener("click",()=>{
    document.getElementById("filtroFecha").value="";
    document.getElementById("filtroEstado").value="";
    pintarReservas();
  });

  pintarReservas();
  cargarMesasDisponibles();

  if(sessionStorage.getItem("abrirFormularioReserva")==="true"){
    const mesaSeleccionada = sessionStorage.getItem("mesaSeleccionada");
    const capacidadMesa = sessionStorage.getItem("capacidadMesa");
    cargarMesasDisponibles();
    const modalBootstrap = new bootstrap.Modal(document.getElementById("modalMesa"));
    modalBootstrap.show();
    const selectMesa = document.getElementById("idMesaAsignada");
    if(selectMesa) selectMesa.value=mesaSeleccionada;
    const inputPersonas = document.getElementById("numeroPersonas");
    if(inputPersonas) inputPersonas.value=capacidadMesa;
    sessionStorage.removeItem("abrirFormularioReserva");
    sessionStorage.removeItem("mesaSeleccionada");
    sessionStorage.removeItem("capacidadMesa");
  }
});
