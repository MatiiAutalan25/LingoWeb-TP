// ===================================================================
// Datos iniciales de demostración de LingoWeb.
// Se cargan en localStorage solo la primera vez que se abre el sitio.
// No usar credenciales ni datos reales.
// ===================================================================
import { fechaDeHoy, fechaRelativa, mesActual } from "../services/fecha.service.js";

// Claves que usa la aplicación en localStorage
export const CLAVES = {
  usuarios: "lingoweb_usuarios", // array con todas las cuentas
  sesion: "lingoweb_sesion", // solo el "usuario" de la persona activa
};

// Cuentas de demostración (contraseña de ambas: demo1234)
export const usuariosIniciales = [
  {
    nombre: "Juan Pérez",
    usuario: "juanperez_web",
    email: "juan.perez@lingoweb.demo",
    password: "demo1234",
    fechaAlta: "2026-08-10",
    idiomaInterfaz: "es",
    liga: "bronce",
    xp: 350,
    xpSemanal: 350,
    racha: 5,
    mejorRacha: 5,
    ultimaPractica: fechaDeHoy(), // ya practicó hoy
    metaDiaria: 50,
    xpHoy: 20,
    leccionesCompletadas: 1,
    cursosCompletados: 0,
    // Ya canjeó la vida extra y un congelador este mes (250 XP gastados)
    xpCanjeado: 250,
    vidas: 3,
    congeladores: 1,
    escudos: 0,
    articulos: [],
    canjes: [
      { id: "vida-1", mes: mesActual() },
      { id: "congelador-1", mes: mesActual() },
    ],
    progreso: {},
  },
  {
    nombre: "María García",
    usuario: "maria_garcia",
    email: "maria.garcia@lingoweb.demo",
    password: "demo1234",
    fechaAlta: "2026-09-02",
    idiomaInterfaz: "es",
    liga: "plata",
    xp: 1250,
    xpSemanal: 430,
    racha: 12,
    mejorRacha: 31,
    ultimaPractica: fechaRelativa(-1), // practicó ayer: la racha sigue si practica hoy
    metaDiaria: 30,
    xpHoy: 0,
    leccionesCompletadas: 14,
    cursosCompletados: 0,
    xpCanjeado: 0,
    vidas: 3,
    congeladores: 0,
    escudos: 0,
    articulos: [],
    canjes: [],
    progreso: {},
  },
];

// Ligas disponibles en el ranking.
// ascienden: cuántos de arriba suben | descienden: cuántos de abajo bajan
export const ligas = [
  { id: "bronce", nombre: "Liga de Bronce", ascienden: 5, descienden: 2, siguiente: "Liga de Plata" },
  { id: "plata", nombre: "Liga de Plata", ascienden: 3, descienden: 2, siguiente: "Liga de Oro" },
  { id: "oro", nombre: "Liga de Oro", ascienden: 0, descienden: 3, siguiente: null },
];

// Participantes de demostración de cada liga (no son cuentas, no inician sesión).
// La Liga de Oro queda vacía a propósito para mostrar el estado sin participantes.
export const participantesPorLiga = {
  bronce: [
    { usuario: "MarkZ_22", iniciales: "MZ", xpSemanal: 420 },
    { usuario: "Elon_Dev", iniciales: "ED", xpSemanal: 330 },
    { usuario: "SteveJ", iniciales: "SJ", xpSemanal: 300 },
    { usuario: "JWalke", iniciales: "JW", xpSemanal: 275 },
    { usuario: "SofIA", iniciales: "SI", xpSemanal: 240 },
    { usuario: "MarIA_26", iniciales: "MI", xpSemanal: 205 },
    { usuario: "Ada_Love", iniciales: "AL", xpSemanal: 180 },
    { usuario: "BillG", iniciales: "BG", xpSemanal: 120 },
    { usuario: "TimBL", iniciales: "TB", xpSemanal: 95 },
  ],
  plata: [
    { usuario: "Linus_T", iniciales: "LT", xpSemanal: 510 },
    { usuario: "GraceH", iniciales: "GH", xpSemanal: 470 },
    { usuario: "KenT", iniciales: "KT", xpSemanal: 390 },
    { usuario: "Dennis_R", iniciales: "DR", xpSemanal: 310 },
    { usuario: "MargaretH", iniciales: "MH", xpSemanal: 260 },
  ],
  oro: [],
};

// Catálogo de logros. "tipo" es la propiedad del usuario que se compara con "meta".
export const catalogoLogros = [
  { icono: "🎯", nombre: "Primeros pasos", tipo: "leccionesCompletadas", meta: 1 },
  { icono: "🔥", nombre: "Racha de 5 días", tipo: "mejorRacha", meta: 5 },
  { icono: "⚡", nombre: "350 XP", tipo: "xp", meta: 350 },
  { icono: "📘", nombre: "10 lecciones", tipo: "leccionesCompletadas", meta: 10 },
  { icono: "📅", nombre: "Racha de 30 días", tipo: "mejorRacha", meta: 30 },
  { icono: "🏆", nombre: "1.000 XP", tipo: "xp", meta: 1000 },
  { icono: "🎓", nombre: "Curso completo", tipo: "cursosCompletados", meta: 1 },
];

// Catálogo de la tienda.
// tipo "racha": se habilita con la racha actual (no se gasta nada).
// tipo "xp": cuesta "requisito" XP del saldo disponible.
// efecto: qué suma el canje. Cada recompensa se canjea una vez por mes.
export const catalogoRecompensas = [
  { id: "vida-1", tipo: "racha", icono: "❤️", nombre: "1 vida extra", requisito: 3, efecto: { tipo: "vidas", cantidad: 1 } },
  { id: "vida-2", tipo: "racha", icono: "❤️", nombre: "2 vidas extra", requisito: 5, efecto: { tipo: "vidas", cantidad: 2 } },
  { id: "escudo", tipo: "racha", icono: "🛡️", nombre: "Escudo de racha", requisito: 14, efecto: { tipo: "escudos", cantidad: 1 } },
  { id: "insignia-imparable", tipo: "racha", icono: "👑", nombre: "Insignia Imparable", requisito: 30, efecto: { tipo: "articulo", logro: true } },
  { id: "congelador-1", tipo: "xp", icono: "🧊", nombre: "1 congelador de racha", requisito: 250, efecto: { tipo: "congeladores", cantidad: 1 } },
  { id: "congelador-3", tipo: "xp", icono: "🧊", nombre: "3 congeladores de racha", requisito: 500, efecto: { tipo: "congeladores", cantidad: 3 } },
  { id: "doble-xp", tipo: "xp", icono: "✨", nombre: "Doble XP por un día", requisito: 1000, efecto: { tipo: "dobleXp" } },
  { id: "marco-dorado", tipo: "xp", icono: "🎨", nombre: "Marco de avatar dorado", requisito: 1500, efecto: { tipo: "articulo" } },
];
