let registroMesa = [];

function guardar() {
  const numero = document.getElementById("numero").value.trim();
  const capMesa = document.getElementById("capaMesa").value.trim();
  const lugar = document.getElementById("lugarMesa").value.trim();
  if (!numero) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No puedes pasar sin asignar un número de mesa!",
    });
  } else if (!capMesa) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No puedes pasar sin registrar la capacidad de personas!",
    });
  } else if (!lugar) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No puedes pasar sin asignar el lugar de la mesa!",
    });
  } else {
    let reg = { numero, capMesa, lugar };
    datos.push(reg);
    console.log(datos);
    pintarDatos();

    document.getElementById("numero").value = "";
    document.getElementById("capaMesa").value = "";
    document.getElementById("lugarMesa").value = "";
    

 
    let modalElement = document.getElementById("miModal");
    let modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
}
