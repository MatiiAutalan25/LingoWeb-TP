// ===================================================================
// Acceso a localStorage. Todo se guarda como JSON.
// ===================================================================

// Lee una clave y la devuelve como objeto/array (o el valor por defecto)
export function leer(clave, valorPorDefecto = null) {
  const dato = localStorage.getItem(clave);
  if (dato === null) {
    return valorPorDefecto;
  }
  try {
    return JSON.parse(dato);
  } catch {
    // Si el dato quedó corrupto, se ignora
    return valorPorDefecto;
  }
}

// Guarda cualquier valor convertido a JSON
export function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Borra una clave
export function eliminar(clave) {
  localStorage.removeItem(clave);
}
