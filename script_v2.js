    // ⏰ 10 mp után törlés
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
});



