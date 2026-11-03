// ===================================================================
// Vista de registro de cuenta de demostración
// ===================================================================
import { registrar, usuarioOcupado, buscarPorEmail } from "../services/user.service.js";
import { irA } from "../services/session.service.js";
import { esEmailValido, esUsuarioValido, LARGO_MIN_PASSWORD } from "../services/validation.service.js";
import { mostrarMensaje, limpiarMensaje, marcarInvalido, limpiarInvalidos } from "./mensajes.view.js";

export function initRegistro() {
  const formulario = document.querySelector(".register-form");
  const inputNombre = document.querySelector("#full-name");
  const inputUsuario = document.querySelector("#user");
  const inputEmail = document.querySelector("#email");
  const inputPassword = document.querySelector("#password");
  const inputConfirmacion = document.querySelector("#confirm-password");
  const botonEnviar = formulario.querySelector('button[type="submit"]');
  const mensaje = document.querySelector("#register-message");

  // Devuelve el primer error encontrado ({ texto, campo }) o null
  function validar() {
    const nombre = inputNombre.value.trim();
    const usuario = inputUsuario.value.trim();
    const email = inputEmail.value.trim();
    const password = inputPassword.value;

    if (nombre === "") return { texto: "Completá tu nombre completo.", campo: inputNombre };
    if (usuario === "") return { texto: "Completá el nombre de usuario.", campo: inputUsuario };
    if (!esUsuarioValido(usuario)) {
      return { texto: "El usuario debe tener entre 3 y 20 caracteres: letras, números o guion bajo.", campo: inputUsuario };
    }
    if (usuarioOcupado(usuario)) {
      return { texto: `El usuario "${usuario}" ya está ocupado. Elegí otro.`, campo: inputUsuario };
    }
    if (email === "") return { texto: "Completá tu email.", campo: inputEmail };
    if (!esEmailValido(email)) return { texto: "El email no tiene un formato válido (ej: nombre@dominio.com).", campo: inputEmail };
    if (buscarPorEmail(email)) return { texto: "Ya existe una cuenta con ese email.", campo: inputEmail };
    if (password.length < LARGO_MIN_PASSWORD) {
      return { texto: `La contraseña debe tener al menos ${LARGO_MIN_PASSWORD} caracteres.`, campo: inputPassword };
    }
    if (inputConfirmacion.value !== password) {
      return { texto: "Las contraseñas no coinciden.", campo: inputConfirmacion };
    }
    return null;
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limpiarInvalidos(formulario);
    limpiarMensaje(mensaje);

    const error = validar();
    if (error) {
      mostrarMensaje(mensaje, error.texto);
      marcarInvalido(error.campo);
      return;
    }

    const nuevo = registrar({
      nombre: inputNombre.value.trim(),
      usuario: inputUsuario.value.trim(),
      email: inputEmail.value.trim(),
      password: inputPassword.value,
    });

    mostrarMensaje(mensaje, `Cuenta @${nuevo.usuario} creada. Te llevamos al inicio de sesión...`, "success");
    botonEnviar.disabled = true;

    setTimeout(() => {
      irA(`login/login.html?registrado=${encodeURIComponent(nuevo.usuario)}`);
    }, 1500);
  });
}
