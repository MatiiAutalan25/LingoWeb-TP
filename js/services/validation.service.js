// ===================================================================
// Reglas de validación compartidas por los formularios.
// ===================================================================

export const LARGO_MIN_PASSWORD = 8;

export function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Letras, números o guion bajo, entre 3 y 20 caracteres
export function esUsuarioValido(usuario) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(usuario);
}
