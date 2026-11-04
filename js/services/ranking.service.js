// ===================================================================
// Ranking: arma la clasificación semanal de una liga.
// Mezcla los participantes demo con las cuentas registradas de esa liga.
// ===================================================================
import { ligas, participantesPorLiga } from "../data/initial-data.js";
import { obtenerUsuarios } from "./user.service.js";

export function obtenerLigas() {
  return ligas;
}

export function obtenerLiga(idLiga) {
  return ligas.find((liga) => liga.id === idLiga) || null;
}

// Texto de ascenso/permanencia que se muestra debajo del nombre de la liga
export function obtenerReglaLiga(liga) {
  if (liga.ascienden > 0 && liga.siguiente) {
    return `Los ${liga.ascienden} primeros ascienden a la ${liga.siguiente} esta semana`;
  }
  return `Es la liga más alta: los ${liga.descienden} últimos descienden esta semana`;
}

function calcularEstado(indice, total, liga) {
  if (indice < liga.ascienden) return "Zona de Ascenso";
  if (indice >= total - liga.descienden) return "Zona de Descenso";
  return "Se mantiene";
}

// Devuelve la lista ordenada por XP semanal, con puesto, estado y si es la persona activa
export function obtenerClasificacion(idLiga, usuarioActivo) {
  const liga = obtenerLiga(idLiga);
  if (!liga) return [];

  const demo = participantesPorLiga[idLiga] || [];
  const cuentas = obtenerUsuarios()
    .filter((u) => u.liga === idLiga)
    .map((u) => ({ usuario: u.usuario, iniciales: u.getIniciales(), xpSemanal: u.xpSemanal }));

  const lista = [...demo, ...cuentas].sort((a, b) => b.xpSemanal - a.xpSemanal);

  return lista.map((participante, indice) => ({
    ...participante,
    puesto: indice + 1,
    estado: calcularEstado(indice, lista.length, liga),
    esActivo: participante.usuario === usuarioActivo.usuario,
  }));
}
