// ------------------------------
// Top 3 logic
// ------------------------------
let top3 = [];
const topList = document.getElementById("top-list");
const artistSelect = document.getElementById("artist-select");
const addBtn = document.getElementById("add-btn");
const feedback = document.getElementById("feedback");
const emptyInfo = document.querySelector(".empty-info");

const allArtists = ["Niink", "Ga", "Ghard", "Veigh", "Lukkas", "MC Kadu", "Nagalli"];

function renderTop3() {
    topList.innerHTML = "";
    top3.forEach(artist => {
        const li = document.createElement("li");
        li.textContent = artist;
        topList.appendChild(li);
    });
    emptyInfo.style.display = top3.length === 0 ? "block" : "none";
}

addBtn.addEventListener("click", () => {
    const selected = artistSelect.value;
    feedback.textContent = "";
    if (!selected) { feedback.textContent = "Escolha um artista primeiro."; return; }

    if (selected === "Nagalli") {
        const available = allArtists.filter(a => a !== "Nagalli" && !top3.includes(a));
        if (available.length === 0) { feedback.textContent = "Não há artistas disponíveis para sortear."; return; }
        const randomArtist = available[Math.floor(Math.random() * available.length)];
        if (top3.length < 3) top3.push(randomArtist);
        else top3[2] = randomArtist;
        renderTop3();
        feedback.textContent = `${randomArtist} foi sorteado!`;
        return;
    }

    if (top3.includes(selected)) { feedback.textContent = "Esse artista já está no ranking."; return; }
    if (top3.length >= 3) { feedback.textContent = "O ranking já tem 3 artistas."; return; }

    top3.push(selected);
    renderTop3();
    feedback.textContent = `${selected} foi adicionado ao Top 3!`;
});

renderTop3();


// ------------------------------
// LÓGICA DO CABELO (S)
// ------------------------------
const hairYes = document.getElementById("hair-yes");
const hairNo = document.getElementById("hair-no");
const proofModal = document.getElementById("proof-modal");
const proofSent = document.getElementById("proof-sent");
const yesModal = document.getElementById("yes-modal");
const noModal = document.getElementById("no-modal");
const closeButtons = document.querySelectorAll(".close-modal");

let escapeCount = 0;
let yesUnlocked = false;

// Impedir propagação em elementos que abrem modais
hairYes.addEventListener("click", e => e.stopPropagation());
hairNo.addEventListener("click", e => e.stopPropagation());
proofSent.addEventListener("click", e => e.stopPropagation());

// Impedir propagação dentro da modal
document.querySelectorAll(".modal-content").forEach(content => {
    content.addEventListener("click", e => e.stopPropagation());
});

function tryEscape() {
    if (yesUnlocked) return;

    escapeCount++;

    if (escapeCount < 5) {
        const x = Math.random() * 180 - 90;
        const y = Math.random() * 120 - 60;
        hairYes.style.transform = `translate(${x}px, ${y}px)`;

        clearTimeout(hairYes._resetTimer);
        hairYes._resetTimer = setTimeout(() => {
            if (!yesUnlocked) hairYes.style.transform = "translate(0,0)";
        }, 900);
    } else {
        proofModal.classList.remove("hidden");
    }
}

/* ============================
   DESKTOP (mouseover normal)
   ============================ */
hairYes.addEventListener("mouseover", () => {
    if (!isMobile()) tryEscape();
});

/* ============================
   MOBILE — CANCELA O CLICK
   ============================ */
hairYes.addEventListener("touchstart", (e) => {
    if (yesUnlocked) return; // se já desbloqueou, deixa clicar normal

    e.preventDefault();      
    e.stopPropagation();     
    tryEscape();

    // Cancelar o clique artificial que o navegador gera logo depois
    hairYes.addEventListener(
        "click",
        function cancelClick(ev) {
            if (!yesUnlocked) {
                ev.preventDefault();
                ev.stopPropagation();
            }
        },
        { once: true }
    );
});

// Detector simples de celular
function isMobile() {
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}



// Enviar prova → desbloqueia SIM
proofSent.addEventListener("click", () => {
    yesUnlocked = true;
    escapeCount = 0;
    hairYes.style.transform = "none";
    proofModal.classList.add("hidden");
});

// Clicar no SIM
hairYes.addEventListener("click", () => {
    if (!yesUnlocked) {
        hairYes.animate([
            { transform: "translateY(0)" },
            { transform: "translateY(-6px)" },
            { transform: "translateY(0)" }
        ], { duration: 260 });
        return;
    }

    yesModal.classList.remove("hidden");
});

// Clicar no NÃO
hairNo.addEventListener("click", () => {
    noModal.classList.remove("hidden");
});

// Botões de fechar
closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        yesModal.classList.add("hidden");
        noModal.classList.add("hidden");
        proofModal.classList.add("hidden");
    });
});

// Fechar clicando fora das modais
document.addEventListener("click", () => {
    yesModal.classList.add("hidden");
    noModal.classList.add("hidden");
    proofModal.classList.add("hidden");
});
