// ===================================================================
// Ayudas de fechas. Se trabaja con texto AAAA-MM-DD en hora local.
// ===================================================================

function aTexto(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export function fechaDeHoy() {
  return aTexto(new Date());
}

// fechaRelativa(-1) = ayer, fechaRelativa(1) = mañana
export function fechaRelativa(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return aTexto(fecha);
}

// Días de calendario entre dos fechas AAAA-MM-DD
export function diasEntre(desde, hasta) {
  const milisegundos = new Date(`${hasta}T00:00:00`) - new Date(`${desde}T00:00:00`);
  return Math.round(milisegundos / 86400000);
}

// "2026-10" (sirve para saber si un canje es de este mes)
export function mesActual() {
  return fechaDeHoy().slice(0, 7);
}
