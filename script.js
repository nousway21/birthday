/* =====================================
   01. ELEMENTS
===================================== */

const accessForm = document.querySelector("#accessForm");
const accessCode = document.querySelector("#accessCode");
const errorMessage = document.querySelector("#errorMessage");

const accessScreen = document.querySelector("#accessScreen");
const countdownScreen = document.querySelector("#countdownScreen");
const celebrationScreen = document.querySelector("#celebrationScreen");
const mathScreen = document.querySelector("#mathScreen");
const physicsScreen = document.querySelector("#physicsScreen");
const fingerprintScreen = document.querySelector("#fingerprintScreen");
const letterScreen = document.querySelector("#letterScreen");

const daysElement = document.querySelector("#days");
const hoursElement = document.querySelector("#hours");
const minutesElement = document.querySelector("#minutes");
const secondsElement = document.querySelector("#seconds");


/* =====================================
   02. CONFIGURATION
===================================== */

const SECRET_CODE = "1911";
const birthdayDate = new Date(2026, 10, 19, 0, 0, 0);
let countdownInterval = null;

const allScreens = [
    accessScreen,
    countdownScreen,
    celebrationScreen,
    mathScreen,
    physicsScreen,
    fingerprintScreen,
    letterScreen
];


/* =====================================
   03. SCREEN MANAGEMENT
===================================== */

function showScreen(screen) {
    allScreens.forEach(item => item.classList.remove("active"));
    screen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =====================================
   04. PASSWORD VALIDATION
===================================== */

accessForm.addEventListener("submit", event => {
    event.preventDefault();

    if (accessCode.value.trim() === SECRET_CODE) {
        errorMessage.classList.remove("show");
        accessForm.reset();
        startExperience();
    } else {
        errorMessage.classList.add("show");
        accessCode.value = "";
        accessCode.focus();
    }
});


/* =====================================
   05. START EXPERIENCE & COUNTDOWN
===================================== */

function startExperience() {
    if (new Date() >= birthdayDate) {
        startCelebration();
    } else {
        showScreen(countdownScreen);
        startCountdown();
    }
}

function startCountdown() {
    updateCountdown();
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const difference = birthdayDate - new Date();

    if (difference <= 0) {
        clearInterval(countdownInterval);
        startCelebration();
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
}


/* =====================================
   06. CELEBRATION & FIREWORKS
===================================== */

function startCelebration() {
    showScreen(celebrationScreen);
    startFireworks();
}

function startFireworks() {
    const canvas = document.querySelector("#fireworks");
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let particles = [];
    let lastBurst = 0;

    function resizeCanvas() {
        const ratio = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function createBurst(x, y) {
        const colors = ["#D9A7B5", "#E8C9A0", "#A85D79", "#F8E9ED", "#FFFFFF"];
        const color = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < 45; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                size: Math.random() * 2.5 + 1,
                color
            });
        }
    }

    function animate(timestamp) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        if (timestamp - lastBurst > 1100) {
            createBurst(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.65);
            lastBurst = timestamp;
        }

        particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.025;
            particle.alpha -= 0.009;

            ctx.globalAlpha = Math.max(0, particle.alpha);
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();

            if (particle.alpha <= 0) particles.splice(index, 1);
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}


/* =====================================
   07. HEART BUTTON
===================================== */

document.querySelector("#heartButton").addEventListener("click", () => {
    showScreen(mathScreen);
});


/* =====================================
   08. QUIZ SYSTEM
===================================== */

function setupQuiz({ optionsId, feedbackId, nextId, correctAnswer, successText, nextScreen }) {
    const options = document.querySelectorAll(`#${optionsId} .quiz-option`);
    const feedback = document.querySelector(`#${feedbackId}`);
    const nextButton = document.querySelector(`#${nextId}`);

    options.forEach(option => {
        option.addEventListener("click", () => {
            if (option.dataset.answer === correctAnswer) {
                options.forEach(item => item.disabled = true);
                feedback.textContent = successText;
                feedback.classList.add("success");
                nextButton.hidden = false;
            } else {
                feedback.textContent = "Bilaman, men siz uchun yasagan narsadan hayajonlanib, xato qildingiz. Yana urinib ko‘rishingiz mumkin!";
                feedback.classList.remove("success");
            }
        });
    });

    nextButton.addEventListener("click", () => showScreen(nextScreen));
}

setupQuiz({
    optionsId: "mathOptions",
    feedbackId: "mathFeedback",
    nextId: "mathNext",
    correctAnswer: "5",
    successText: "Siz matematika o‘qituvchilarining ichida eng zo‘ri ekanligingizni isbotladingiz!",
    nextScreen: physicsScreen
});

setupQuiz({
    optionsId: "physicsOptions",
    feedbackId: "physicsFeedback",
    nextId: "physicsNext",
    correctAnswer: "5",
    successText: "Siz fizika o‘qituvchilarining ichida eng zo‘ri ekanligingizni isbotladingiz!",
    nextScreen: fingerprintScreen
});


/* =====================================
   09. FINGERPRINT HOLD INTERACTION
===================================== */

const fingerprintButton = document.querySelector("#fingerprintButton");
const fingerprintHint = document.querySelector("#fingerprintHint");
let holdTimer = null;
let hasOpenedLetter = false;

function startFingerprintHold(event) {
    event.preventDefault();
    if (hasOpenedLetter) return;

    fingerprintButton.classList.add("holding");
    fingerprintHint.textContent = "Yana biroz ushlab turing...";

    holdTimer = setTimeout(() => {
        hasOpenedLetter = true;
        fingerprintButton.classList.remove("holding");
        showScreen(letterScreen);
    }, 1300);
}

function cancelFingerprintHold() {
    clearTimeout(holdTimer);
    fingerprintButton.classList.remove("holding");
    if (!hasOpenedLetter) fingerprintHint.textContent = "Bosib turing";
}

fingerprintButton.addEventListener("pointerdown", startFingerprintHold);
fingerprintButton.addEventListener("pointerup", cancelFingerprintHold);
fingerprintButton.addEventListener("pointerleave", cancelFingerprintHold);
fingerprintButton.addEventListener("pointercancel", cancelFingerprintHold);


/* =====================================
   10. DEVELOPMENT PREVIEW MODES
===================================== */

const previewMode = new URLSearchParams(window.location.search).get("preview");

if (previewMode === "countdown") {
    showScreen(countdownScreen);
    startCountdown();
}

if (previewMode === "birthday") startCelebration();
if (previewMode === "math") showScreen(mathScreen);
if (previewMode === "physics") showScreen(physicsScreen);
if (previewMode === "fingerprint") showScreen(fingerprintScreen);
if (previewMode === "letter") showScreen(letterScreen);
