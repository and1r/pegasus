import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔥 Firebase init
const app = initializeApp({
  apiKey: "AIzaSyADfPsLgzF9JKrQUSEB4pIN4xmeSjos404",
  databaseURL: "https://pegasus-90f8c-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = getDatabase(app);
const msgRef = ref(db, "messages");

// DOM elemek
const input = document.getElementById("msg");
const button = document.getElementById("send");
const container = document.getElementById("messages");

// 📩 Üzenet küldése (Firebase push!)
button.onclick = () => {
  const text = input.value.trim();
  if (!text) return;

  push(msgRef, {
    text: text,
    createdAt: Date.now()
  });

  input.value = "";
};

// 📥 Üzenetek figyelése
onValue(msgRef, (snapshot) => {
  container.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const key = child.key;

    const age = Date.now() - data.createdAt;

    // ⏰ 10 mp után törlés
    if (age >= 10000) {
      remove(ref(db, `messages/${key}`));
      return;
    }

    const p = document.createElement("p");
    p.textContent = data.text;
    container.appendChild(p);

    setTimeout(() => {
      remove(ref(db, `messages/${key}`));
    }, 10000 - age);
  });
});
