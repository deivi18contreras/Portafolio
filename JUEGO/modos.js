 document.getElementById("config-btn").addEventListener("click", function (e) {
    e.preventDefault();
    const menuConfig = document.querySelector(".menu_config");
    menuConfig.classList.toggle("active");
  });