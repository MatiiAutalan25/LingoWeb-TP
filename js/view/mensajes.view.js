// ===================================================================
// Ayudas para mostrar mensajes y marcar campos en los formularios.
// El mensaje siempre es texto explícito (no depende solo del color).
// ===================================================================

// tipo: "error" | "success"
export function mostrarMensaje(elemento, texto, tipo = "error") {
  elemento.textContent = texto;
  elemento.className = `form-message ${tipo}`;
}

export function limpiarMensaje(elemento) {
  elemento.textContent = "";
  elemento.className = "form-message";
}

// Marca el campo con error y lleva el foco hacia él
export function marcarInvalido(input) {
  input.setAttribute("aria-invalid", "true");
  input.focus();
}

export function limpiarInvalidos(formulario) {
  formulario.querySelectorAll("[aria-invalid]").forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
}
