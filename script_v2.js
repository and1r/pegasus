import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔥 Firebase init
const app = initializeApp({
  apiKey: "AIzaSyADfPsLgzF9JKrQUSEB4pIN4xmeSjos404",
  databaseURL: "https://pegasus-90f8c-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = getDatabase(app);
const msgRef = ref(db, "messages");

// DOM elemek
const loginDiv = document.getElementById("login");
const usernameInput = document.getElementById("usernameInput");
const loginBtn = document.getElementById("loginBtn");

const chatDiv = document.getElementById("chat");
const input = document.getElementById("msg");
const button = document.getElementById("send");
const container = document.getElementById("messages");

let username = "";

// Belépés kezelése
loginBtn.onclick = () => {
  const name = usernameInput.value.trim();
  if (!name) return;
  username = name;

  loginDiv.style.display = "none";
  chatDiv.style.display = "block";
  input.focus();
};

// Üzenet küldés függvény
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  push(msgRef, {
    user: username,
    text: text,
    createdAt: Date.now()
  });

  input.value = "";
  input.focus();
}

// Gomb + Enter esemény
button.onclick = sendMessage;
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

// Üzenetek figyelése
onValue(msgRef, (snapshot) => {
  container.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const key = child.key;
    const age = Date.now() - data.createdAt;

    // 10 mp után törlés
    if (age >= 10000) {
      remove(ref(db, `messages/${key}`));
      return;
    }

    const p = document.createElement("p");
    p.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
    container.appendChild(p);

    setTimeout(() => {
      remove(ref(db, `messages/${key}`));
    }, 10000 - age);
  });

  // Scroll legutolsó üzenethez
  container.scrollTop = container.scrollHeight;
});
