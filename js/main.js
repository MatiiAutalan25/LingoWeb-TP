// ===================================================================
// Punto de entrada. Cada página se identifica con <body data-page="...">
// y carga este archivo con <script type="module">.
// ===================================================================
import { inicializarDatos, obtenerUsuarioActivo } from "./services/user.service.js";
import { irA } from "./services/session.service.js";
import { initLogin } from "./view/login.view.js";
import { initRegistro } from "./view/registro.view.js";
import { initRecuperar } from "./view/recuperar.view.js";

// Páginas sin sesión (acceso)
const vistasPublicas = {
  login: initLogin,
  registro: initRegistro,
  recuperar: initRecuperar,
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
}
