// ===================================================================
// Header compartido: racha, XP y avatar del usuario activo.
// Para usarlo en otra página, el .quick-stats debe tener los ids
// #header-racha, #header-xp y #header-avatar.
// ===================================================================

export function renderHeader(usuario) {
  const racha = document.querySelector("#header-racha");
  const xp = document.querySelector("#header-xp");
  const avatar = document.querySelector("#header-avatar");

  if (racha) racha.textContent = `🔥 ${usuario.racha} ${usuario.racha === 1 ? "día" : "días"}`;
  if (xp) xp.textContent = `⚡ ${usuario.xp} XP`;
  if (avatar) {
    avatar.textContent = usuario.getIniciales();
    // Marco dorado canjeado en la tienda
    avatar.classList.toggle("marco-dorado", usuario.tieneArticulo("marco-dorado"));
    avatar.setAttribute("aria-label", `Mi perfil (${usuario.nombre})`);
  }
}
