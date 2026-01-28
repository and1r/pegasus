import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔥 Firebase init
const app = initializeApp({
  apiKey: "AIzaSyADfPsLgzF9JKrQUSEB4pIN4xmeSjos404",
  databaseURL: "https://pegasus-90f8c-default-rtdb.europe-west1.firebasedatabase.app"
});

// 🔐 Auth
const auth = getAuth(app);
signInAnonymously(auth);

// 🗄️ DB
const db = getDatabase(app);
const msgRef = ref(db, "messages");

// 🧑 Username
let username = "";
while (!username) {
  username = prompt("Add meg a neved:");
  if (username) username = username.trim().slice(0, 20);
}

// DOM
const input = document.getElementById("msg");
const button = document.getElementById("send");
const container = document.getElementById("messages");

// 📤 Küldés
function sendMessage() {
  const text = input.value.trim();
  if (!text || !auth.currentUser) return;

  push(msgRef, {
    uid: auth.currentUser.uid,
    user: username,
    text: text.slice(0, 200),
    createdAt: Date.now()
  });

  input.value = "";
}

button.onclick = sendMessage;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

// 📥 Üzenetek figyelése
onChildAdded(msgRef, (snapshot) => {
  const data = snapshot.val();
  const key = snapshot.key;

  const p = document.createElement("p");
  p.textContent = `${data.user}: ${data.text}`;
  container.appendChild(p);

  // ⏰ kliens oldali törlés (demo)
  setTimeout(() => {
    remove(ref(db, `messages/${key}`));
  }, 10000);
});



