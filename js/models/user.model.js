// ===================================================================
// Modelo Usuario: forma de una cuenta y métodos de ayuda.
// ===================================================================
import { fechaDeHoy, mesActual } from "../services/fecha.service.js";

export class Usuario {
  // "datos" es un objeto con los valores de la cuenta (por ejemplo, lo que se leyó
  // de localStorage). Si un dato no viene, se usa el valor por defecto.
  // El operador ?? significa: "si lo de la izquierda es null o undefined, usá lo de
  // la derecha". Se usa ?? y no || para no perder valores en 0 (por ej. 0 vidas).
  constructor(datos = {}) {
    // ----- Cuenta -----
    this.nombre = datos.nombre ?? "";
    this.usuario = datos.usuario ?? "";
    this.email = datos.email ?? "";
    this.password = datos.password ?? "";
    this.fechaAlta = datos.fechaAlta ?? fechaDeHoy();
    this.idiomaInterfaz = datos.idiomaInterfaz ?? "es";
    this.liga = datos.liga ?? "bronce";

    // ----- Actividad -----
    this.xp = datos.xp ?? 0; // XP total histórico (perfil y logros)
    this.xpSemanal = datos.xpSemanal ?? 0; // XP de la semana (ranking)
    this.racha = datos.racha ?? 0;
    this.mejorRacha = datos.mejorRacha ?? 0;
    this.ultimaPractica = datos.ultimaPractica ?? ""; // AAAA-MM-DD del último día con actividad
    this.metaDiaria = datos.metaDiaria ?? 50; // XP a sumar por día
    this.xpHoy = datos.xpHoy ?? 0; // XP sumado el día de ultimaPractica
    this.leccionesCompletadas = datos.leccionesCompletadas ?? 0;
    this.cursosCompletados = datos.cursosCompletados ?? 0;

    // ----- Tienda -----
    this.xpCanjeado = datos.xpCanjeado ?? 0; // XP gastado en la tienda
    this.vidas = datos.vidas ?? 3;
    this.congeladores = datos.congeladores ?? 0;
    this.escudos = datos.escudos ?? 0;
    this.dobleXpHasta = datos.dobleXpHasta ?? 0; // timestamp hasta el que rige el doble XP
    this.articulos = datos.articulos ?? []; // ids de artículos permanentes (insignia, marco)
    this.canjes = datos.canjes ?? []; // { id, mes } de cada canje

    // ----- Progreso de cursos y lecciones -----
    // Espacio reservado para las vistas de cursos, mapas y lecciones.
    // Se guarda por usuario, así que el avance de cada cuenta queda separado.
    // Solo se guardan los campos definidos en este constructor: cualquier dato
    // nuevo de los cursos tiene que ir dentro de "progreso".
    //
    // Forma sugerida (se puede adaptar según lo que necesiten):
    //   progreso: {
    //     ingles: { leccionActual: "ingles-2", completadas: ["ingles-1"], resultados: { "ingles-1": { aciertos: 3, xp: 15 } } },
    //     aleman: { ... },
    //     chino:  { ... },
    //   }
    //
    // Cómo leerlo y guardarlo (js/services/user.service.js):
    //   const usuario = obtenerUsuarioActivo();
    //   if (!usuario.progreso.ingles) {
    //     usuario.progreso.ingles = { leccionActual: "ingles-1", completadas: [], resultados: {} };
    //   }
    //   usuario.progreso.ingles.completadas.push("ingles-1");
    //   actualizarUsuario(usuario);
    //
    // Al terminar una lección, llamar además a:
    //   sumarXp(cantidad)   -> suma XP total, semanal (ranking) y de hoy (meta diaria), y extiende la racha
    //   completarLeccion()  -> suma 1 a "leccionesCompletadas" (perfil y logros)
    // No hace falta tocar xp, racha ni leccionesCompletadas a mano.
    //
    // Importante: guardar el progreso con actualizarUsuario() ANTES de llamar a
    // sumarXp() / completarLeccion(). Esas funciones leen el usuario guardado;
    // si después se guarda un objeto leído antes, se pisa el XP recién sumado.
    this.progreso = datos.progreso ?? {};
  }

  // "Juan Pérez" -> "JP". Si no hay nombre, usa el usuario.
  getIniciales() {
    const palabras = this.nombre.trim().split(/\s+/).filter(Boolean);
    if (palabras.length === 0) {
      return this.usuario.slice(0, 2).toUpperCase();
    }
    return palabras
      .slice(0, 2)
      .map((palabra) => palabra[0])
      .join("")
      .toUpperCase();
  }

  // "2026-08-10" -> "agosto de 2026"
  getFechaAltaTexto() {
    const fecha = new Date(`${this.fechaAlta}T00:00:00`);
    return fecha.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  }

  // Separa el catálogo en logros conseguidos y próximos
  getLogros(catalogo) {
    return {
      conseguidos: catalogo.filter((logro) => this[logro.tipo] >= logro.meta),
      proximos: catalogo.filter((logro) => !(this[logro.tipo] >= logro.meta)),
    };
  }

  // XP que todavía se puede gastar en la tienda
  getXpDisponible() {
    return Math.max(0, this.xp - this.xpCanjeado);
  }

  // XP sumado hoy (0 si hoy todavía no practicó)
  getXpDeHoy() {
    return this.ultimaPractica === fechaDeHoy() ? this.xpHoy : 0;
  }

  // Los canjes se reinician cada mes
  fueCanjeadoEsteMes(idRecompensa) {
    return this.canjes.some((canje) => canje.id === idRecompensa && canje.mes === mesActual());
  }

  tieneArticulo(idArticulo) {
    return this.articulos.includes(idArticulo);
  }

  tieneDobleXp() {
    return Date.now() < this.dobleXpHasta;
  }
}
