// ===================================================================
// Vista de recuperación de contraseña (proceso simulado, no envía nada)
// ===================================================================
import { buscarPorEmail } from "../services/user.service.js";
import { esEmailValido } from "../services/validation.service.js";
import { mostrarMensaje, limpiarMensaje, marcarInvalido, limpiarInvalidos } from "./mensajes.view.js";

export function initRecuperar() {
  const formulario = document.querySelector(".recover-form");
  const inputEmail = document.querySelector("#email");
  const mensaje = document.querySelector("#recover-message");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limpiarInvalidos(formulario);
    limpiarMensaje(mensaje);

    const email = inputEmail.value.trim();

    if (email === "") {
      mostrarMensaje(mensaje, "Completá el email asociado a tu cuenta.");
      marcarInvalido(inputEmail);
      return;
    }
    if (!esEmailValido(email)) {
      mostrarMensaje(mensaje, "El email no tiene un formato válido (ej: nombre@dominio.com).");
      marcarInvalido(inputEmail);
      return;
    }
    if (!buscarPorEmail(email)) {
      mostrarMensaje(mensaje, "No encontramos una cuenta registrada con ese email.");
      marcarInvalido(inputEmail);
      return;
    }

    mostrarMensaje(
      mensaje,
      `Listo: enviamos un enlace de recuperación a ${email} (envío simulado). Ya podés volver a iniciar sesión.`,
      "success"
    );
    formulario.reset();
  });
}
