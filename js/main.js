// ===================================================================
// Punto de entrada. Cada página se identifica con <body data-page="...">
// y carga este archivo con <script type="module">.
// ===================================================================
import { inicializarDatos, obtenerUsuarioActivo, actualizarUsuario } from "./services/user.service.js";
import { cerrarSesion, irA } from "./services/session.service.js";
import { verificarRacha } from "./services/racha.service.js";
import { renderHeader } from "./view/header.view.js";
import { initLogin } from "./view/login.view.js";
import { initRegistro } from "./view/registro.view.js";
import { initRecuperar } from "./view/recuperar.view.js";
import { initPerfil } from "./view/perfil.view.js";

// Páginas sin sesión (acceso)
const vistasPublicas = {
  login: initLogin,
  registro: initRegistro,
  recuperar: initRecuperar,
};

// Páginas que requieren sesión. Los módulos de cursos pueden sumar las suyas acá.
const vistasPrivadas = {
  perfil: initPerfil,
};

inicializarDatos();

const pagina = document.body.dataset.page;
const usuario = obtenerUsuarioActivo();

if (pagina in vistasPublicas) {
  // Si ya hay sesión, no tiene sentido volver a loguearse
  if (usuario) {
    irA("dashboard/dashboard.html");
  } else {
    vistasPublicas[pagina]();
  }
} else if (!usuario) {
  // Página privada sin sesión válida: volver al acceso
  cerrarSesion();
  irA("login/login.html");
} else {
  // Si pasaron días sin práctica, se usan congeladores o se corta la racha
  if (verificarRacha(usuario)) {
    actualizarUsuario(usuario);
  }
  renderHeader(usuario);
  vistasPrivadas[pagina]?.(usuario);
}
