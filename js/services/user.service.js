// ===================================================================
// Usuarios: alta, login, búsqueda y actualización en localStorage.
// ===================================================================
import { leer, guardar } from "./storage.service.js";
import { obtenerUsuarioEnSesion } from "./session.service.js";
import { registrarPractica } from "./racha.service.js";
import { fechaDeHoy } from "./fecha.service.js";
import { CLAVES, usuariosIniciales, participantesPorLiga } from "../data/initial-data.js";
import { Usuario } from "../models/user.model.js";

// Compara sin importar mayúsculas ni espacios
function normalizar(texto) {
  return String(texto).trim().toLowerCase();
}

// Carga las cuentas demo la primera vez que se abre el sitio
export function inicializarDatos() {
  if (leer(CLAVES.usuarios) === null) {
    guardar(CLAVES.usuarios, usuariosIniciales);
  }
}

// Devuelve todas las cuentas como instancias de Usuario
export function obtenerUsuarios() {
  return leer(CLAVES.usuarios, []).map((datos) => new Usuario(datos));
}

function guardarUsuarios(usuarios) {
  guardar(CLAVES.usuarios, usuarios);
}

export function buscarPorUsuario(usuario) {
  return obtenerUsuarios().find((u) => normalizar(u.usuario) === normalizar(usuario)) || null;
}

export function buscarPorEmail(email) {
  return obtenerUsuarios().find((u) => normalizar(u.email) === normalizar(email)) || null;
}

// Un usuario está ocupado si ya es una cuenta o un participante demo del ranking
export function usuarioOcupado(usuario) {
  const esParticipante = Object.values(participantesPorLiga)
    .flat()
    .some((p) => normalizar(p.usuario) === normalizar(usuario));
  return esParticipante || buscarPorUsuario(usuario) !== null;
}

// Acepta usuario o email. Devuelve el Usuario o null si no coincide.
export function login(identificador, password) {
  const id = normalizar(identificador);
  const cuenta = obtenerUsuarios().find(
    (u) => normalizar(u.usuario) === id || normalizar(u.email) === id
  );
  if (cuenta && cuenta.password === password) {
    return cuenta;
  }
  return null;
}

// Crea y guarda una cuenta nueva sin actividad
export function registrar(datos) {
  const nuevo = new Usuario(datos);
  const usuarios = obtenerUsuarios();
  usuarios.push(nuevo);
  guardarUsuarios(usuarios);
  return nuevo;
}

// Reemplaza la cuenta con el mismo "usuario" por la versión actualizada
export function actualizarUsuario(actualizado) {
  const usuarios = obtenerUsuarios().map((u) =>
    u.usuario === actualizado.usuario ? actualizado : u
  );
  guardarUsuarios(usuarios);
}

// Usuario de la sesión activa (datos frescos de localStorage) o null
export function obtenerUsuarioActivo() {
  const id = obtenerUsuarioEnSesion();
  return id ? buscarPorUsuario(id) : null;
}

// ----- Funciones para los módulos de cursos/lecciones -----

// Suma XP al usuario activo: total, semanal (ranking) y de hoy (meta diaria).
// También extiende la racha si es la primera actividad del día.
// Si tiene "Doble XP" activo, la cantidad se duplica.
export function sumarXp(cantidad) {
  const usuario = obtenerUsuarioActivo();
  if (!usuario) return null;

  const ganada = usuario.tieneDobleXp() ? cantidad * 2 : cantidad;
  if (usuario.ultimaPractica !== fechaDeHoy()) {
    usuario.xpHoy = 0; // primer XP del día
  }
  registrarPractica(usuario);

  usuario.xp += ganada;
  usuario.xpSemanal += ganada;
  usuario.xpHoy += ganada;
  actualizarUsuario(usuario);
  return usuario;
}

// Suma una lección completada al usuario activo
export function completarLeccion() {
  const usuario = obtenerUsuarioActivo();
  if (!usuario) return null;
  usuario.leccionesCompletadas += 1;
  actualizarUsuario(usuario);
  return usuario;
}
