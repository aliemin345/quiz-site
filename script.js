let currentQuestion = 0; 
let score = 0;
let userName = "";
let userAnswers = [];

const questions = [
    {
        image: "images/baykus.jpg.JPG",
        options: ["Kedi", "Baykuş", "Köpek"],
        answer: "Baykuş"
    },
    {
        image: "images/baykus.jpg.JPG",
        options: ["Tavşan", "Kedi", "Kurt"],
        answer: "Kedi"
    },
    {
        image: "images/baykus.jpg.JPG",
        options: ["Kurt", "Tilki", "Aslan"],
        answer: "Kurt"
    },
    {
        image: "images/baykus.jpg.JPG",
        options: ["Kaplan", "Aslan", "Panter"],
        answer: "Aslan"
    },
    {
        image: "images/baykus.jpg.JPG",
        options: ["Tavşan", "Sincap", "Fare"],
        answer: "Tavşan"
    }
];

async function startQuiz() {
    const input = document.getElementById("username");
    const name = input.value.trim();
    if (name === "") {
        alert("Lütfen adını yaz.");
        return;
    }

    // Firebase’den tekrar giriş kontrolü
    const snapshot = await db.collection("scores")
        .where("name", "==", name)
        .get();

    if (!snapshot.empty) {
        alert("Bu isimle zaten testi tamamladınız.");
        return;
    }

    userName = name;
    currentQuestion = 0;
    score = 0;
    userAnswers = [];

    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";
    document.getElementById("result-screen").style.display = "none";

    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];
    document.getElementById("question-number").textContent = `Soru ${currentQuestion + 1} / ${questions.length}`;
    document.getElementById("quiz-image").src = q.image;

    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => selectAnswer(option, btn);
        optionsDiv.appendChild(btn);
    });
}

function selectAnswer(selected, button) {
    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll("#options button");
    buttons.forEach(btn => btn.disabled = true);

    userAnswers[currentQuestion] = selected;

    if (selected === q.answer) {
        score++;
        button.style.backgroundColor = "green";
    } else {
        button.style.backgroundColor = "red";
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            submitQuiz();
        }
    }, 1000);
}

function submitQuiz() {
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "block";
    document.getElementById("user-name").textContent = userName;
    // Skoru göstermiyoruz, sadece teşekkür ediyoruz

    db.collection("scores").add({
        name: userName,
        score: score,
        answers: userAnswers,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Skor ve cevaplar başarıyla kaydedildi!");
    })
    .catch((error) => {
        console.error("Hata:", error);
    });
}
