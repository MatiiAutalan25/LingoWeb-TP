// ===================================================================
// Vista de ranking: selector de liga + tabla de clasificación
// ===================================================================
import { obtenerLiga, obtenerReglaLiga, obtenerClasificacion } from "../services/ranking.service.js";

const MEDALLAS = { 1: "🥇", 2: "🥈", 3: "🥉" };

// Crea una fila <tr> con puesto, avatar + nombre, XP y estado.
// Se usa textContent para no interpretar como HTML los nombres de usuario.
function crearFila(participante) {
  const fila = document.createElement("tr");
  if (participante.esActivo) fila.classList.add("current-user");

  // Puesto
  const puesto = document.createElement("th");
  puesto.scope = "row";
  const medalla = MEDALLAS[participante.puesto];
  if (medalla) {
    const icono = document.createElement("span");
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = medalla;
    puesto.append(icono, " ");
  }
  puesto.append(String(participante.puesto));

  // Estudiante
  const celdaEstudiante = document.createElement("td");
  const estudiante = document.createElement("div");
  estudiante.className = "student";
  const avatar = document.createElement("span");
  avatar.className = "student-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = participante.iniciales;
  const nombre = participante.esActivo ? `${participante.usuario} (Tú)` : participante.usuario;
  estudiante.append(avatar, nombre);
  celdaEstudiante.append(estudiante);

  // XP y estado
  const xp = document.createElement("td");
  xp.textContent = `${participante.xpSemanal} XP`;
  const estado = document.createElement("td");
  estado.textContent = participante.estado;

  fila.append(puesto, celdaEstudiante, xp, estado);
  return fila;
}

export function initRanking(usuario) {
  const select = document.querySelector("#league");
  const tabla = document.querySelector(".ranking-table");
  const cuerpo = document.querySelector("#ranking-body");
  const nombreLiga = document.querySelector("#ranking-league-name");
  const reglaLiga = document.querySelector("#ranking-league-rule");
  const mensajeVacio = document.querySelector("#ranking-empty");

  function render(idLiga) {
    const liga = obtenerLiga(idLiga);
    const clasificacion = obtenerClasificacion(idLiga, usuario);

    tabla.dataset.liga = idLiga;
    nombreLiga.textContent = liga.nombre;
    reglaLiga.textContent = obtenerReglaLiga(liga);

    // Estado vacío: mensaje en lugar de una tabla sin filas
    if (clasificacion.length === 0) {
      tabla.hidden = true;
      mensajeVacio.textContent = `Todavía no hay participantes en la ${liga.nombre} esta semana.`;
      mensajeVacio.hidden = false;
      return;
    }

    tabla.hidden = false;
    mensajeVacio.hidden = true;
    cuerpo.innerHTML = "";
    clasificacion.forEach((participante) => cuerpo.append(crearFila(participante)));
  }

  // Arranca mostrando la liga de la persona activa
  select.value = usuario.liga;
  render(select.value);
  select.addEventListener("change", () => render(select.value));
}
