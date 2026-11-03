// ===================================================================
// Rachas: se actualizan según los días con práctica (ultimaPractica).
// Estas funciones modifican el usuario; quien las llama lo guarda.
// ===================================================================
import { fechaDeHoy, fechaRelativa, diasEntre } from "./fecha.service.js";

// Se llama al entrar a una página con sesión.
// Si hubo días sin práctica, usa congeladores para cubrirlos o corta la racha.
// Devuelve true si cambió algo (para guardarlo).
export function verificarRacha(usuario) {
  if (!usuario.ultimaPractica || usuario.racha === 0) return false;

  const diasPerdidos = diasEntre(usuario.ultimaPractica, fechaDeHoy()) - 1;
  if (diasPerdidos <= 0) return false;

  if (usuario.congeladores >= diasPerdidos) {
    // Los congeladores cubren los días perdidos: la racha sigue viva
    usuario.congeladores -= diasPerdidos;
    usuario.ultimaPractica = fechaRelativa(-1);
  } else {
    usuario.racha = 0;
  }
  return true;
}

// Se llama cuando el usuario suma XP (completa actividad).
// El primer ejercicio del día extiende la racha.
export function registrarPractica(usuario) {
  const hoy = fechaDeHoy();
  if (usuario.ultimaPractica === hoy) return;

  verificarRacha(usuario);
  usuario.racha += 1;
  usuario.mejorRacha = Math.max(usuario.mejorRacha, usuario.racha);
  usuario.ultimaPractica = hoy;
}
