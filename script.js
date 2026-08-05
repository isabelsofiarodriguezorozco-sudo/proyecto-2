/* ==========================================================================
   CONFIGURACIÓN Y DATOS DEL JUEGO (GUESS THE WORD)
   ========================================================================== */

// Lista de palabras secretas con sus respectivas pistas
const WORDS_DATABASE = [
  { word: "JAVASCRIPT", hint: "Lenguaje de programación principal para la web" },
  { word: "CSS", hint: "Lenguaje de estilos usado para diseñar páginas web" },
  { word: "HTML", hint: "Lenguaje de marcado para la estructura de páginas web" },
  { word: "FRONTEND", hint: "Parte de la aplicación web que interactúa con el usuario" },
  { word: "ARCADE", hint: "Lugar o plataforma de minijuegos interactivos" }
];

// Variables de estado del juego
let currentWordObj = null;    // Almacena la palabra y pista actual
let guessedLetters = [];      // Arreglo con las letras adivinadas por el usuario
let remainingAttempts = 5;     // Intentos restantes antes de perder

/* ==========================================================================
   SELECCIÓN DE ELEMENTOS DEL DOM (DOCUMENT OBJECT MODEL)
   ========================================================================== */

// Elementos del Modal del Juego
const gameModal = document.getElementById("game-modal");
const btnPlayGuess = document.getElementById("btn-play-guess");
const btnCloseGameModal = document.getElementById("close-modal");
const wordDisplay = document.getElementById("word-display");
const gameHint = document.getElementById("game-hint");
const attemptsCount = document.getElementById("attempts-count");
const guessForm = document.getElementById("guess-form");
const letterInput = document.getElementById("letter-input");
const gameMessage = document.getElementById("game-message");
const btnRestart = document.getElementById("btn-restart");

// Elementos del Modal de Autenticación (Login / Registro)
const authModal = document.getElementById("auth-modal");
const btnOpenAuth = document.getElementById("btn-open-auth");
const btnCloseAuthModal = document.getElementById("close-auth-modal");
const tabLoginBtn = document.getElementById("tab-login-btn");
const tabRegisterBtn = document.getElementById("tab-register-btn");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");

// Elementos del Estado de Usuario en la Navbar
const userProfileBadge = document.getElementById("user-profile");
const userDisplayName = document.getElementById("user-display-name");
const btnLogout = document.getElementById("btn-logout");

/* ==========================================================================
   LÓGICA DEL JUEGO: GUESS THE WORD
   ========================================================================== */

/**
 * Inicializa una nueva partida eligiendo una palabra aleatoria
 */
function initGame() {
  // Resetear el mensaje de victoria/derrota
  gameMessage.textContent = "";
  gameMessage.className = "game-message";
  
  // Reiniciar lista de letras intentadas e intentos iniciales
  guessedLetters = [];
  remainingAttempts = 5;
  attemptsCount.textContent = remainingAttempts;

  // Habilitar de nuevo los controles de texto y envío
  letterInput.disabled = false;
  guessForm.querySelector("button").disabled = false;

  // Seleccionar una palabra al azar de la base de datos
  const randomIndex = Math.floor(Math.random() * WORDS_DATABASE.length);
  currentWordObj = WORDS_DATABASE[randomIndex];

  // Mostrar la pista en la interfaz
  gameHint.textContent = currentWordObj.hint;

  // Renderizar los espacios en blanco para la palabra
  renderWordDisplay();
}

/**
 * Genera visualmente los cuadros para cada letra de la palabra
 */
function renderWordDisplay() {
  // Limpiar el contenedor antes de renderizar
  wordDisplay.innerHTML = "";

  // Recorrer cada letra de la palabra actual
  for (let char of currentWordObj.word) {
    // Crear un elemento <span> para la letra
    const letterSpan = document.createElement("span");
    letterSpan.classList.add("letter-box");

    // Si la letra ya fue adivinada, la mostramos; si no, dejamos el espacio en blanco
    if (guessedLetters.includes(char)) {
      letterSpan.textContent = char;
      letterSpan.classList.add("revealed");
    } else {
      letterSpan.textContent = "_";
    }

    // Agregar la casilla al contenedor de la interfaz
    wordDisplay.appendChild(letterSpan);
  }
}

/**
 * Procesa la letra enviada por el usuario
 * @param {Event} e - Evento submit del formulario
 */
function handleGuessSubmit(e) {
  // Prevenir que la página se recargue al enviar el formulario
  e.preventDefault();

  // Obtener la letra en mayúscula y limpiar espacios
  const letter = letterInput.value.trim().toUpperCase();
  letterInput.value = ""; // Limpiar el input

  // Validar que se haya ingresado una sola letra válida
  if (!letter || letter.length !== 1 || !/[A-Z]/.test(letter)) {
    showMessage(gameMessage, "Por favor ingresa una letra válida.", "error");
    return;
  }

  // Validar si la letra ya había sido intentada previamente
  if (guessedLetters.includes(letter)) {
    showMessage(gameMessage, `Ya habías probado con la letra '${letter}'.`, "warning");
    return;
  }

  // Agregar la letra a la lista de letras jugadas
  guessedLetters.push(letter);

  // Comprobar si la letra forma parte de la palabra
  if (currentWordObj.word.includes(letter)) {
    showMessage(gameMessage, `¡Excelente! La letra '${letter}' es correcta.`, "success");
  } else {
    // Restar un intento si la letra no pertenece a la palabra
    remainingAttempts--;
    attemptsCount.textContent = remainingAttempts;
    showMessage(gameMessage, `La letra '${letter}' no está en la palabra.`, "error");
  }

  // Actualizar la pantalla con las letras descubiertas
  renderWordDisplay();

  // Comprobar condiciones de fin de juego (Victoria o Derrota)
  checkGameStatus();
}

/**
 * Verifica si el jugador ha ganado o ha agotado sus intentos
 */
function checkGameStatus() {
  // Separa las letras de la palabra objetivo
  const targetLetters = currentWordObj.word.split("");
  
  // Verifica si todas las letras de la palabra han sido adivinadas
  const isWon = targetLetters.every(char => guessedLetters.includes(char));

  if (isWon) {
    showMessage(gameMessage, "🎉 ¡Felicidades! Has adivinado la palabra.", "success");
    disableGameControls();
  } else if (remainingAttempts <= 0) {
    showMessage(gameMessage, `💥 ¡Juego Terminado! La palabra era: ${currentWordObj.word}`, "error");
    disableGameControls();
  }
}

/**
 * Desactiva el campo de entrada cuando se termina la partida
 */
function disableGameControls() {
  letterInput.disabled = true;
  guessForm.querySelector("button").disabled = true;
}

/* ==========================================================================
   SISTEMA DE AUTENTICACIÓN (LOGIN Y REGISTRO CON LOCALSTORAGE)
   ========================================================================== */

/**
 * Registra un nuevo usuario en el LocalStorage
 * @param {Event} e - Evento de formulario
 */
function handleRegister(e) {
  e.preventDefault();

  // Obtener los datos del formulario de registro
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim().toLowerCase();
  const password = document.getElementById("reg-password").value;

  // Recuperar lista existente de usuarios o iniciar arreglo vacío
  const users = JSON.parse(localStorage.getItem("arcade_users")) || [];

  // Verificar si el correo ya está registrado
  const userExists = users.some(u => u.email === email);
  if (userExists) {
    showMessage(registerMessage, "Este correo electrónico ya está registrado.", "error");
    return;
  }

  // Guardar el nuevo usuario en la lista
  const newUser = { username, email, password };
  users.push(newUser);
  localStorage.setItem("arcade_users", JSON.stringify(users));

  // Notificar al usuario y pasar al login
  showMessage(registerMessage, "¡Cuenta creada con éxito! Ahora inicia sesión.", "success");
  registerForm.reset();

  // Cambiar a la pestaña de inicio de sesión automáticamente tras 1.5s
  setTimeout(() => {
    switchAuthTab("login");
  }, 1500);
}

/**
 * Inicia la sesión de un usuario existente
 * @param {Event} e - Evento de formulario
 */
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  // Obtener la lista de usuarios guardados
  const users = JSON.parse(localStorage.getItem("arcade_users")) || [];

  // Buscar coincidencia de correo y contraseña
  const validUser = users.find(u => u.email === email && u.password === password);

  if (validUser) {
    // Guardar la sesión activa en localStorage
    localStorage.setItem("arcade_session", JSON.stringify(validUser));
    
    // Actualizar la interfaz para reflejar la sesión iniciada
    updateUIAuth();

    // Cerrar el modal de login
    authModal.classList.remove("active");
    loginForm.reset();
    loginMessage.textContent = "";
  } else {
    showMessage(loginMessage, "Correo o contraseña incorrectos.", "error");
  }
}

/**
 * Cierra la sesión del usuario actual
 */
function handleLogout() {
  // Eliminar la sesión guardada de localStorage
  localStorage.removeItem("arcade_session");
  // Actualizar la vista
  updateUIAuth();
}

/**
 * Comprueba el estado de sesión actual y ajusta la Navbar
 */
function updateUIAuth() {
  // Comprobar si existe una sesión activa almacenada
  const activeSession = JSON.parse(localStorage.getItem("arcade_session"));

  if (activeSession && btnOpenAuth && userProfileBadge) {
    // Si hay usuario logueado: Ocultar botón Ingresar y mostrar Perfil
    btnOpenAuth.classList.add("hidden");
    userProfileBadge.classList.remove("hidden");
    userDisplayName.textContent = activeSession.username;
  } else if (btnOpenAuth && userProfileBadge) {
    // Si no hay usuario: Mostrar botón Ingresar y ocultar Perfil
    btnOpenAuth.classList.remove("hidden");
    userProfileBadge.classList.add("hidden");
  }
}

/**
 * Alterna la vista entre la pestaña de Login y Registro
 * @param {string} tab - Pestaña objetivo ('login' o 'register')
 */
function switchAuthTab(tab) {
  if (tab === "login") {
    tabLoginBtn.classList.add("active");
    tabRegisterBtn.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  } else {
    tabRegisterBtn.classList.add("active");
    tabLoginBtn.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  }
}

/* ==========================================================================
   FUNCIONES AUXILIARES DE INTERFAZ
   ========================================================================== */

/**
 * Muestra un mensaje estilizado en el contenedor indicado
 * @param {HTMLElement} element - Elemento donde se muestra el mensaje
 * @param {string} text - Texto del mensaje
 * @param {string} type - Tipo de mensaje: 'error', 'success', 'warning'
 */
function showMessage(element, text, type) {
  element.textContent = text;
  element.className = `game-message ${type}`;
}

/* ==========================================================================
   ASIGNACIÓN DE EVENTOS (EVENT LISTENERS)
   ========================================================================== */

// Eventos para abrir y cerrar el Modal del Juego
if (btnPlayGuess) {
  btnPlayGuess.addEventListener("click", () => {
    gameModal.classList.add("active");
    initGame(); // Iniciar una nueva partida al abrir
  });
}

if (btnCloseGameModal) {
  btnCloseGameModal.addEventListener("click", () => {
    gameModal.classList.remove("active");
  });
}

// Evento para reiniciar la partida (LÍNEA SOLICITADA)
if (btnRestart) {
  btnRestart.addEventListener("click", initGame);
}

// Evento para procesar cada intento de letra
if (guessForm) {
  guessForm.addEventListener("submit", handleGuessSubmit);
}

// Eventos para el Modal de Autenticación
if (btnOpenAuth) {
  btnOpenAuth.addEventListener("click", () => {
    authModal.classList.add("active");
  });
}

if (btnCloseAuthModal) {
  btnCloseAuthModal.addEventListener("click", () => {
    authModal.classList.remove("active");
  });
}

// Cambiar entre pestañas Login y Registro
if (tabLoginBtn && tabRegisterBtn) {
  tabLoginBtn.addEventListener("click", () => switchAuthTab("login"));
  tabRegisterBtn.addEventListener("click", () => switchAuthTab("register"));
}

// Envío de formularios de Autenticación
if (loginForm) loginForm.addEventListener("submit", handleLogin);
if (registerForm) registerForm.addEventListener("submit", handleRegister);

// Cerrar sesión
if (btnLogout) btnLogout.addEventListener("click", handleLogout);

/* ==========================================================================
   INICIALIZACIÓN AL CARGAR LA PÁGINA
   ========================================================================== */

// Ejecutar la verificación de sesión tan pronto como carga la página
document.addEventListener("DOMContentLoaded", () => {
  updateUIAuth();
});