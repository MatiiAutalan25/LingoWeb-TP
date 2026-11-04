// ===================================================================
// Vista de perfil: datos, logros, ajustes de cuenta y cierre de sesión
// ===================================================================
import { actualizarUsuario, buscarPorEmail } from "../services/user.service.js";
import { cerrarSesion, irA } from "../services/session.service.js";
import { esEmailValido, LARGO_MIN_PASSWORD } from "../services/validation.service.js";
import { catalogoLogros, catalogoRecompensas } from "../data/initial-data.js";
import { renderHeader } from "./header.view.js";
import { mostrarMensaje, limpiarMensaje, marcarInvalido, limpiarInvalidos } from "./mensajes.view.js";

// ----- Tarjeta de información personal -----
function renderInfo(usuario) {
  const avatar = document.querySelector("#perfil-avatar");
  avatar.textContent = usuario.getIniciales();
  avatar.classList.toggle("marco-dorado", usuario.tieneArticulo("marco-dorado"));
  document.querySelector("#perfil-nombre").textContent = usuario.nombre;
  document.querySelector("#perfil-usuario").textContent = `@${usuario.usuario}`;
  document.querySelector("#perfil-email").textContent = usuario.email;
  document.querySelector("#perfil-fecha").textContent = `Miembro desde ${usuario.getFechaAltaTexto()}`;
  document.querySelector("#perfil-xp").textContent = usuario.xp;
  document.querySelector("#perfil-racha").textContent =
    `${usuario.mejorRacha} ${usuario.mejorRacha === 1 ? "día" : "días"}`;
  document.querySelector("#perfil-lecciones").textContent = usuario.leccionesCompletadas;
}

// Crea un <li> de logro con el mismo HTML que tenía la maqueta
function crearItemLogro(logro) {
  const item = document.createElement("li");
  const icono = document.createElement("span");
  icono.className = "badge";
  icono.setAttribute("aria-hidden", "true");
  icono.textContent = logro.icono;
  const nombre = document.createElement("span");
  nombre.textContent = logro.nombre;
  item.append(icono, nombre);
  return item;
}

function renderLista(lista, logros, textoVacio) {
  lista.innerHTML = "";
  if (logros.length === 0) {
    const item = document.createElement("li");
    item.textContent = textoVacio;
    lista.append(item);
    return;
  }
  logros.forEach((logro) => lista.append(crearItemLogro(logro)));
}

function renderLogros(usuario) {
  const { conseguidos, proximos } = usuario.getLogros(catalogoLogros);

  // Las insignias canjeadas en la tienda se muestran junto a los logros
  catalogoRecompensas
    .filter((r) => r.efecto.logro && usuario.tieneArticulo(r.id))
    .forEach((r) => conseguidos.push({ icono: r.icono, nombre: r.nombre }));
  renderLista(
    document.querySelector("#logros-conseguidos"),
    conseguidos,
    "Todavía no tenés logros. Completá tu primera lección para conseguir el primero."
  );
  renderLista(document.querySelector("#logros-proximos"), proximos, "Conseguiste todos los logros disponibles.");
}

export function initPerfil(usuario) {
  const formulario = document.querySelector(".settings-form");
  const inputNombre = document.querySelector("#full-name");
  const inputEmail = document.querySelector("#email");
  const selectIdioma = document.querySelector("#language");
  const inputActual = document.querySelector("#current-password");
  const inputNueva = document.querySelector("#new-password");
  const inputConfirmacion = document.querySelector("#confirm-password");
  const botonCerrar = document.querySelector("#btn-logout");
  const mensaje = document.querySelector("#settings-message");

  // Carga los valores guardados en el formulario
  function cargarFormulario() {
    inputNombre.value = usuario.nombre;
    inputEmail.value = usuario.email;
    selectIdioma.value = usuario.idiomaInterfaz;
    inputActual.value = "";
    inputNueva.value = "";
    inputConfirmacion.value = "";
  }

  renderInfo(usuario);
  renderLogros(usuario);
  cargarFormulario();

  // Devuelve el primer error ({ texto, campo }) o null
  function validar() {
    const nombre = inputNombre.value.trim();
    const email = inputEmail.value.trim();

    if (nombre === "") return { texto: "El nombre no puede quedar vacío.", campo: inputNombre };
    if (email === "") return { texto: "El email no puede quedar vacío.", campo: inputEmail };
    if (!esEmailValido(email)) return { texto: "El email no tiene un formato válido (ej: nombre@dominio.com).", campo: inputEmail };

    const duenoDelEmail = buscarPorEmail(email);
    if (duenoDelEmail && duenoDelEmail.usuario !== usuario.usuario) {
      return { texto: "Ese email ya lo usa otra cuenta.", campo: inputEmail };
    }

    // La contraseña solo se valida si se completó alguno de sus campos
    const quiereCambiarPassword = inputActual.value || inputNueva.value || inputConfirmacion.value;
    if (quiereCambiarPassword) {
      if (inputActual.value !== usuario.password) {
        return { texto: "La contraseña actual no es correcta.", campo: inputActual };
      }
      if (inputNueva.value.length < LARGO_MIN_PASSWORD) {
        return { texto: `La nueva contraseña debe tener al menos ${LARGO_MIN_PASSWORD} caracteres.`, campo: inputNueva };
      }
      if (inputConfirmacion.value !== inputNueva.value) {
        return { texto: "La confirmación no coincide con la nueva contraseña.", campo: inputConfirmacion };
      }
    }
    return null;
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limpiarInvalidos(formulario);
    limpiarMensaje(mensaje);

    const error = validar();
    if (error) {
      // No se guarda nada si hay errores
      mostrarMensaje(mensaje, `No se guardaron los cambios: ${error.texto}`);
      marcarInvalido(error.campo);
      return;
    }

    usuario.nombre = inputNombre.value.trim();
    usuario.email = inputEmail.value.trim();
    usuario.idiomaInterfaz = selectIdioma.value;
    if (inputNueva.value) {
      usuario.password = inputNueva.value;
    }
    actualizarUsuario(usuario);

    // Refleja los cambios en la pantalla y en el header
    renderInfo(usuario);
    renderHeader(usuario);
    cargarFormulario();
    mostrarMensaje(mensaje, "Cambios guardados correctamente.", "success");
  });

  botonCerrar.addEventListener("click", () => {
    cerrarSesion();
    irA("login/login.html?sesion=cerrada");
  });
}
