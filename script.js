// Firebase SDK importálása
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase konfiguráció
const firebaseConfig = {
  apiKey: "AIzaSyADfPsLgzF9JKrQUSEB4pIN4xmeSjos404",
  authDomain: "pegasus-90f8c.firebaseapp.com",
  databaseURL: "https://pegasus-90f8c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pegasus-90f8c",
  storageBucket: "pegasus-90f8c.firebasestorage.app",
  messagingSenderId: "935889631524",
  appId: "1:935889631524:web:03e6de551f2dfcfa909bb1",
  measurementId: "G-DMN7V7G5XC"
};

// Firebase alkalmazás inicializálása
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const msgRef = ref(db, "message");

// Üzenet küldése
document.getElementById("send").onclick = () => {
  const text = document.getElementById("msg").value;

  if (!text) return;

  set(msgRef, {
    text: text,
    time: Date.now()
  });

    // Üzenet megjelenítése a DOM-ban
  const messagesDiv = document.getElementById("messages");
  const newMessage = document.createElement("p");
  newMessage.textContent = text;
  messagesDiv.appendChild(newMessage);

  // Üzenet küldése után az input mezőt ürítjük
  document.getElementById("msg").value = "";

  // Az üzenet 10 másodperc múlva eltávolítjuk Firebase-ből
  setTimeout(() => {
    remove(msgRef);
  }, 10000);
};

// Realtime adatfigyelés Firebase-ről
onValue(msgRef, (snapshot) => {
  const data = snapshot.val();
  document.getElementById("message").innerText = data ? data.text : "";
});