// ===================================================================
// Sesión: guarda solo el identificador de la persona activa.
// Los datos se buscan siempre en la lista de usuarios (user.service).
// ===================================================================
import { leer, guardar, eliminar } from "./storage.service.js";
import { CLAVES } from "../data/initial-data.js";

export function iniciarSesion(usuario) {
  guardar(CLAVES.sesion, usuario);
}

// Devuelve el "usuario" activo o null
export function obtenerUsuarioEnSesion() {
  return leer(CLAVES.sesion);
}

// Quita la identificación activa (las cuentas siguen guardadas)
export function cerrarSesion() {
  eliminar(CLAVES.sesion);
}

// Navega a una página dentro de /pages, sin importar en qué carpeta esté
// la página actual. Ej: irA("login/login.html")
export function irA(ruta) {
  window.location.href = new URL(`../../pages/${ruta}`, import.meta.url).href;
}
