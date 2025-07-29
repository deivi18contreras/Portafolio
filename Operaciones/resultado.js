function respuesta() {
  let numer1 = parseFloat(document.getElementById("n1").value);
  let numer2 = parseFloat(document.getElementById("n2").value);
  let rep = document.getElementById("resultado");

  if (document.getElementById("su").checked) {
    rep.textContent = numer1 + numer2;
  } else if (document.getElementById("re").checked) {
    rep.textContent = numer1 - numer2;
  } else if (document.getElementById("mu").checked) {
    rep.textContent = numer1 * numer2;
  } else if (document.getElementById("di").checked) {
    rep.textContent =
      numer2 !== 0 ? numer1 / numer2 : "No se puede dividir por cero";
  } else {
    rep.textContent = "seleccione una opereacion ";
  }
}

