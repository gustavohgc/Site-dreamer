// ======================================================
//   SCRIPT GLOBAL (Para index.html, produtos, etc.)
// ======================================================
// Este script gere o estado do header (ex: "Olá, Gutyh" vs "Entrar")
// e a função de LOGOUT.

// 1. IMPORTAÇÕES
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged,
  signOut // <-- IMPORTANTE: A função de logout
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// 2. CONFIGURAÇÃO )
const firebaseConfig = {
  apiKey: "AIzaSyBpAgZMHjz0yk4LDle6b9bdEHWmuLXQmUQ",
  authDomain: "meusite-login.firebaseapp.com",
  projectId: "meusite-login",
  storageBucket: "meusite-login.firebasestorage.app",
  messagingSenderId: "133209410475",
  appId: "1:133209410475:web:8de840ccb41a9f643de0ee",
  measurementId: "G-15NMNRGP61"
};

// 3. INICIALIZAÇÃO
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. SELETORES DOS BOTÕES DO HEADER

const btnHeaderLogin = document.getElementById('btn-header-login');
const btnHeaderLogout = document.getElementById('btn-header-logout');
const headerUserName = document.getElementById('header-user-name');



onAuthStateChanged(auth, async (user) => {
  if (user) {
    // ------ USUÁRIO ESTÁ LOGADO ------
    
    // 1. Buscar o nome dele no Firestore
    try {
      const userDocRef = doc(db, "usuarios", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        
        headerUserName.textContent = 'Olá, ' + userDocSnap.data().nome;
      } else if (user.displayName) {
        
        headerUserName.textContent = 'Olá, ' + user.displayName;
      } else {
        
        headerUserName.textContent = 'Olá, ' + user.email;
      }
    } catch (error) {
      console.error("Erro ao buscar nome do usuário:", error);
      headerUserName.textContent = 'Olá!';
    }

    // 2. Mostrar/Esconder os botões
    headerUserName.style.display = 'inline';
    btnHeaderLogout.style.display = 'inline-block';
    btnHeaderLogin.style.display = 'none'; // Esconde o 👤

  } else {
    // ------ USUÁRIO ESTÁ DESLOGADO ------
    
    // Apenas mostramos/escondemos os botões
    headerUserName.style.display = 'none';
    btnHeaderLogout.style.display = 'none';
    btnHeaderLogin.style.display = 'inline-block'; // Mostra o 👤
  }
});

// ======================================================
//   A FUNÇÃO DE LOGOUT
// ======================================================

// Adiciona um "ouvinte" de clique no botão "Sair"
// (Verifica se o botão existe antes de adicionar o ouvinte)
if (btnHeaderLogout) {
  btnHeaderLogout.addEventListener('click', () => {
    signOut(auth).then(() => {
      // Logout bem-sucedido
      alert('Você foi desconectado.');
      // Recarrega a página para o onAuthStateChanged atualizar o header
      window.location.reload(); 
    }).catch((error) => {
      // Ocorreu um erro
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao sair. Tente novamente.');
    });
  });
}

// ======================================================
//   FUNÇÃO DO BOTÃO DE LOGIN (👤)
// ======================================================

// Adiciona um "ouvinte" de clique no botão 👤
// (Verifica se o botão existe antes de adicionar o ouvinte)
if (btnHeaderLogin) {
  btnHeaderLogin.addEventListener('click', () => {
    // Redireciona o usuário para a página de login
    window.location.href = 'entrar.html';
  });
}