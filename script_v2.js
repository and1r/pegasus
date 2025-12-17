
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const app = initializeApp({
  apiKey: "AIzaSyADfPsLgzF9JKrQUSEB4pIN4xmeSjos404",
  databaseURL: "https://pegasus-90f8c-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = getDatabase(app);
const msgRef = ref(db, "message");

const input = document.getElementById("msg");
const button = document.getElementById("send");
const container = document.getElementById("messages");

if (!input || !button || !container) {
  console.error("DOM elem hiányzik!", { input, button, container });
}

button.onclick = () => {
  const text = input.value.trim();
  if (!text) return;

  push(msgRef, {
    text,
    createdAt: Date.now()
  });

  input.value = "";
};

onValue(msgRef, (snapshot) => {
  if (!container) return;

  container.innerHTML = "";
  const data = snapshot.val();
  if (!data) return;

  const age = Date.now() - data.createdAt;

  if (age >= 10000) {
    remove(msgRef);
    return;
  }

  const p = document.createElement("p");
  p.textContent = data.text;
  container.appendChild(p);

  setTimeout(() => {
    remove(msgRef);
  }, 10000 - age);
});