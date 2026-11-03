// ===================================================================
// Vista de inicio de sesión
// ===================================================================
import { login } from "../services/user.service.js";
import { iniciarSesion, irA } from "../services/session.service.js";
import { mostrarMensaje, limpiarMensaje, marcarInvalido, limpiarInvalidos } from "./mensajes.view.js";

export function initLogin() {
  const formulario = document.querySelector(".login-form");
  const inputUsuario = document.querySelector("#user");
  const inputPassword = document.querySelector("#password");
  const mensaje = document.querySelector("#login-message");

  // Mensajes que llegan desde otras pantallas por la URL
  const parametros = new URLSearchParams(window.location.search);
  if (parametros.has("registrado")) {
    inputUsuario.value = parametros.get("registrado");
    mostrarMensaje(mensaje, "Cuenta creada. Ingresá tu contraseña para iniciar sesión.", "success");
  } else if (parametros.get("sesion") === "cerrada") {
    mostrarMensaje(mensaje, "Cerraste sesión correctamente.", "success");
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limpiarInvalidos(formulario);
    limpiarMensaje(mensaje);

    const identificador = inputUsuario.value.trim();
    const password = inputPassword.value;

    if (identificador === "") {
      mostrarMensaje(mensaje, "Completá tu usuario o email.");
      marcarInvalido(inputUsuario);
      return;
    }
    if (password === "") {
      mostrarMensaje(mensaje, "Completá tu contraseña.");
      marcarInvalido(inputPassword);
      return;
    }

    const usuario = login(identificador, password);
    if (!usuario) {
      mostrarMensaje(mensaje, "No reconocemos esa cuenta: revisá el usuario/email y la contraseña.");
      inputPassword.value = "";
      marcarInvalido(inputPassword);
      return;
    }

    iniciarSesion(usuario.usuario);
    irA("dashboard/dashboard.html");
  });
}
