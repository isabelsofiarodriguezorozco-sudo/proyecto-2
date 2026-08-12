document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. AUTENTICACIÓN: REGISTRO OBLIGATORIO PRIMERO
    // ==========================================
    const authModal = document.getElementById('auth-modal');
    const btnOpenAuth = document.getElementById('btn-open-auth');
    const btnCloseAuth = document.getElementById('close-auth-modal');
    
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    
    const linkToLogin = document.getElementById('link-to-login');
    const linkToRegister = document.getElementById('link-to-register');
  
    const userProfile = document.getElementById('user-profile');
    const userDisplayName = document.getElementById('user-display-name');
    const btnLogout = document.getElementById('btn-logout');
  
    // Abrir Modal
    if (btnOpenAuth) {
      btnOpenAuth.addEventListener('click', () => {
        authModal.style.display = 'flex';
        authModal.classList.add('active');
      });
    }
  
    // Cerrar Modal
    if (btnCloseAuth) {
      btnCloseAuth.addEventListener('click', () => {
        authModal.classList.remove('active');
        authModal.style.display = 'none';
      });
    }
  
    // Alternar a Formulario de Login (Si ya tiene cuenta)
    if (linkToLogin) {
      linkToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
      });
    }
  
    // Alternar a Formulario de Registro (Ir primero a registrarse)
    if (linkToRegister) {
      linkToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
      });
    }
  
    // PASO 1: REGISTRAR USUARIO
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
  
        // Guardar en la base de datos local (localStorage)
        const userData = { username, email, password };
        localStorage.setItem('registered_user', JSON.stringify(userData));
  
        alert('¡Registro exitoso! Ahora puedes iniciar sesión con tus datos.');
        
        // Pasar automáticamente al login tras registrarse
        registerForm.reset();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
      });
    }
  
    // PASO 2: INICIAR SESIÓN TRAS REGISTRO
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
  
        const storedUser = JSON.parse(localStorage.getItem('registered_user'));
  
        if (!storedUser) {
          alert('No existe ninguna cuenta registrada. Por favor, regístrate primero.');
          loginForm.classList.add('hidden');
          registerForm.classList.remove('hidden');
          return;
        }
  
        if (storedUser.email === email && storedUser.password === password) {
          localStorage.setItem('active_session', storedUser.username);
          updateAuthUI(storedUser.username);
  
          authModal.classList.remove('active');
          authModal.style.display = 'none';
          loginForm.reset();
        } else {
          alert('Correo o contraseña incorrectos.');
        }
      });
    }
  
    // Cerrar Sesión
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        localStorage.removeItem('active_session');
        updateAuthUI(null);
      });
    }
  
    function updateAuthUI(username) {
      if (username) {
        if (btnOpenAuth) btnOpenAuth.classList.add('hidden');
        if (userProfile) {
          userProfile.classList.remove('hidden');
          userDisplayName.innerText = username;
        }
      } else {
        if (btnOpenAuth) btnOpenAuth.classList.remove('hidden');
        if (userProfile) userProfile.classList.add('hidden');
      }
    }
  
    // Cargar sesión activa al iniciar
    const activeSession = localStorage.getItem('active_session');
    updateAuthUI(activeSession);
  
  
    // ==========================================
    // 2. CONTROLADOR DE JUEGOS TÉCNICOS
    // ==========================================
    const gameModal = document.getElementById('game-modal');
    const closeGameBtn = document.getElementById('close-modal');
    const gameContainer = document.getElementById('game-box-container');
  
    if (closeGameBtn) {
      closeGameBtn.addEventListener('click', () => {
        gameModal.classList.remove('active');
        gameModal.style.display = 'none';
      });
    }
  
    window.openGame = (gameType) => {
      if (!gameModal || !gameContainer) return;
      gameModal.style.display = 'flex';
      gameModal.classList.add('active');
  
      if (gameType === 'guess') initGuessWord();
      else if (gameType === 'ahorcado') initAhorcado();
      else if (gameType === 'tictactoe') initTicTacToe();
      else if (gameType === 'memorama') initMemorama();
    };
  
  
    // ==========================================
    // JUEGO 1: GUESS THE WORD (Programación Web)
    // ==========================================
    function initGuessWord() {
      const word = "VARIABLE";
      let attempts = 5;
      let guessed = Array(word.length).fill('_');
  
      gameContainer.innerHTML = `
        <h2><i class="fa-solid fa-code"></i> Guess The Word</h2>
        <p style="color:var(--text-muted); margin-top:5px;"><strong>Tema:</strong> Conceptos Web</p>
        <p style="margin-top:10px;"><strong>Pista:</strong> Espacio en memoria para almacenar datos dinámicos en JavaScript.</p>
        <p style="margin-top:10px;">Intentos restantes: <strong id="att" style="color:var(--primary-glow);">${attempts}</strong></p>
        <h1 style="letter-spacing:10px; margin: 20px 0;" id="disp">${guessed.join(' ')}</h1>
        
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:15px;">
          <input type="text" id="inp" maxlength="1" style="padding:10px; width:50px; text-align:center; font-size:18px; text-transform:uppercase;">
          <button onclick="checkGuess()" class="btn-card" style="width:auto; padding:0 20px;">Probar</button>
        </div>
        <p id="msg" style="font-weight:bold; min-height:24px;"></p>
      `;
  
      window.checkGuess = () => {
        const inp = document.getElementById('inp');
        const letter = inp.value.toUpperCase();
        inp.value = '';
        if (!letter) return;
  
        if (word.includes(letter)) {
          for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) guessed[i] = letter;
          }
          document.getElementById('disp').innerText = guessed.join(' ');
          if (!guessed.includes('_')) {
            document.getElementById('msg').innerText = "¡Excelente! Adivinaste el concepto.";
            document.getElementById('msg').style.color = "#00ff88";
          }
        } else {
          attempts--;
          document.getElementById('att').innerText = attempts;
          if (attempts <= 0) {
            document.getElementById('msg').innerText = `Game Over. La palabra era: ${word}`;
            document.getElementById('msg').style.color = "#ff4444";
          }
        }
      };
    }
  
  
    // ==========================================
    // JUEGO 2: AHORCADO (Sintaxis y Lenguajes)
    // ==========================================
    function initAhorcado() {
      const word = "PYTHON";
      let errors = 0;
      const maxErrors = 6;
      let guessed = Array(word.length).fill('_');
  
      gameContainer.innerHTML = `
        <h2><i class="fa-solid fa-laptop-code"></i> Ahorcado Dev</h2>
        <p style="color:var(--text-muted); margin-top:5px;"><strong>Tema:</strong> Lenguajes de Programación</p>
        <p style="margin-top:10px;">Errores cometidos: <strong id="err" style="color:#ff4444;">${errors}</strong> / ${maxErrors}</p>
        <h1 style="letter-spacing:8px; margin: 20px 0;" id="disp">${guessed.join(' ')}</h1>
        
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:15px;">
          <input type="text" id="inp-ah" maxlength="1" style="padding:10px; width:50px; text-align:center; font-size:18px; text-transform:uppercase;">
          <button onclick="checkAhorcado()" class="btn-card" style="width:auto; padding:0 20px;">Probar Letra</button>
        </div>
        <p id="msg-ah" style="font-weight:bold; min-height:24px;"></p>
      `;
  
      window.checkAhorcado = () => {
        const inp = document.getElementById('inp-ah');
        const letter = inp.value.toUpperCase();
        inp.value = '';
        if (!letter) return;
  
        if (word.includes(letter)) {
          for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) guessed[i] = letter;
          }
          document.getElementById('disp').innerText = guessed.join(' ');
          if (!guessed.includes('_')) {
            document.getElementById('msg-ah').innerText = "¡Sintaxis correcta! Has completado la palabra.";
            document.getElementById('msg-ah').style.color = "#00ff88";
          }
        } else {
          errors++;
          document.getElementById('err').innerText = errors;
          if (errors >= maxErrors) {
            document.getElementById('msg-ah').innerText = `Error de compilación. El lenguaje era: ${word}`;
            document.getElementById('msg-ah').style.color = "#ff4444";
          }
        }
      };
    }
  
  
    // ==========================================
    // JUEGO 3: TIC TAC TOE (Frontend vs Backend)
    // ==========================================
    function initTicTacToe() {
      let board = ["", "", "", "", "", "", "", "", ""];
      let turn = "X";
      let gameOver = false;
  
      const renderBoard = () => {
        const role = turn === "X" ? "Frontend (X)" : "Backend (O)";
        gameContainer.innerHTML = `
          <h2><i class="fa-solid fa-xmark"></i> Tic Tac Toe</h2>
          <p style="color:var(--text-muted); margin-top:5px;"><strong>Tema:</strong> Frontend (X) vs Backend (O)</p>
          <p style="margin-top:10px;">Turno de: <strong style="color:var(--primary-glow);">${role}</strong></p>
          <div style="display:grid; grid-template-columns: repeat(3, 70px); gap: 10px; justify-content: center; margin: 20px auto;">
            ${board.map((cell, idx) => `
              <button onclick="makeMove(${idx})" style="height:70px; font-size:24px; font-weight:bold; cursor:pointer; background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.2); border-radius:8px;">${cell}</button>
            `).join('')}
          </div>
          <p id="ttt-msg" style="font-weight:bold; min-height:24px;"></p>
        `;
      };
  
      window.makeMove = (idx) => {
        if (board[idx] !== "" || gameOver) return;
        board[idx] = turn;
        if (checkWin()) {
          renderBoard();
          const winner = turn === "X" ? "Frontend" : "Backend";
          document.getElementById('ttt-msg').innerText = `¡El equipo ${winner} gana la partida!`;
          document.getElementById('ttt-msg').style.color = "#00ff88";
          gameOver = true;
          return;
        }
        if (!board.includes("")) {
          renderBoard();
          document.getElementById('ttt-msg').innerText = "¡Empate entre capas de desarrollo!";
          gameOver = true;
          return;
        }
        turn = turn === "X" ? "O" : "X";
        renderBoard();
      };
  
      function checkWin() {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        return wins.some(comb => comb.every(i => board[i] === turn));
      }
  
      renderBoard();
    }
  
  
    // ==========================================
    // JUEGO 4: MEMORAMA (Iconos de Tecnologías)
    // ==========================================
    function initMemorama() {
      const icons = ['💻', '⚡', '🛠️', '💻', '⚡', '🛠️'];
      const shuffled = icons.sort(() => 0.5 - Math.random());
      let flipped = [];
      let matched = [];
  
      const renderMemorama = () => {
        gameContainer.innerHTML = `
          <h2><i class="fa-solid fa-clone"></i> Memorama Dev</h2>
          <p style="color:var(--text-muted); margin-top:5px;"><strong>Tema:</strong> Tecnologías y Herramientas</p>
          <p style="margin-top:10px;">Encuentra los pares de herramientas coincidentes</p>
          <div style="display:grid; grid-template-columns: repeat(3, 75px); gap: 10px; justify-content: center; margin: 20px auto;">
            ${shuffled.map((icon, idx) => {
              const isFlipped = flipped.includes(idx) || matched.includes(idx);
              return `
                <button onclick="flipCard(${idx})" style="height:75px; font-size:28px; cursor:pointer; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:8px;">
                  ${isFlipped ? icon : '❓'}
                </button>
              `;
            }).join('')}
          </div>
          <p id="memo-msg" style="font-weight:bold; min-height:24px; color:#00ff88;">
            ${matched.length === shuffled.length ? '¡Felicidades, emparejaste todas las tecnologías!' : ''}
          </p>
        `;
      };
  
      window.flipCard = (idx) => {
        if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
        flipped.push(idx);
        renderMemorama();
  
        if (flipped.length === 2) {
          const [first, second] = flipped;
          if (shuffled[first] === shuffled[second]) {
            matched.push(first, second);
            flipped = [];
            renderMemorama();
          } else {
            setTimeout(() => {
              flipped = [];
              renderMemorama();
            }, 900);
          }
        }
      };
  
      renderMemorama();
    }
  
  });