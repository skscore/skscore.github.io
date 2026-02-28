const panelTemplate = `
<div class="quiz-panel">
    <div class="quiz-subject" style="background-color: {color};">
        <div class="row">
            <div class="inner">
                <span>{subject}</span>
            </div>
            <div class="score-inner">
                <span>{score}</span>
            </div>
        </div>
    </div>
    <div class="quiz-info">
        <span class="quiz-title">{name}</span>
        <div class="other-info">
            <span>ID : {id}</span>
        </div>
    </div>
</div>
`;

const colors = [
    "#efe3c9",
    "#f5d8cb",
    "#bcf1c9",
    "#fde5cd",
    "#aaf5e1",
    "#debff6",
    "#fdb5d3",
    "#aaf1e8",
    "#b9ffee",
    "#d1eff8",
    "#f8c6d4",
    "#b0e8fb",
    "#aaf9f2",
    "#bae9ec",
    "#e3c8fe",
    "#fce7a6",
    "#fce7a6",
    "#a9ffa7",
    "#f1d0e8",
    "#f3b2d2",
    "#dad7f3",
    "#baf0bb"
]

function mulberry32(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function hash(s) {
  let hash = 0;
  for (const char of s) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash);
}


fetch('https://score.nsk-score.workers.dev/get', {
    method: 'GET',
    credentials: 'include'
}).then(async (res) => {
    document.getElementById('loading').classList.add("hidden");
    if(res.status == 200) {
        const response = await res.json();
        document.getElementById('student-id-info').innerText = `Student ${response.student_id}`;
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = "";

        const quizList = response.quiz;
        if(quizList.length === 0) {
            document.getElementById('no-quiz-info').classList.remove("hidden");
        }else {
            quizList.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            const colorMap = new Map();
            const availableColors = colors.slice();
            for(const quiz of quizList) {
                let color;
                if(colorMap.has(quiz.subject)) {
                    color = colorMap.get(quiz.subject);
                }else {
                    const size = availableColors.length;
                    const h = hash(quiz.subject + navigator.userAgent);
                    const rnd = mulberry32(h)();
                    const idx = Math.min(Math.floor(rnd * size), size - 1);
                    color = availableColors[idx];
                    availableColors.splice(idx, 1);

                    colorMap.set(quiz.subject, color);
                }
                quizContainer.innerHTML += panelTemplate
                    .replace('{subject}', quiz.subject)
                    .replace('{score}', Math.round(quiz.score * 100) / 100)
                    .replace('{name}', quiz.name)
                    .replace('{id}', quiz.id)
                    .replace('{color}', color);
            }
        }

        document.getElementById('hello-container').classList.remove("hidden");
        document.getElementById('quiz-container').classList.remove("hidden");
    }else if(res.status == 401 || res.status == 403) {
        window.location.replace("/login");
    }else if(res.status == 429) {
        document.getElementById('error').classList.remove('hidden');
        document.querySelector('#error > h1').innerText = 'You reached the rate limit. Please try again later.';
    }else {
        console.error("http error " + res.status);
        document.getElementById('error').classList.remove('hidden');
    }
}).catch((e) => {
    console.error(e);
    document.getElementById('loading').classList.add("hidden");
    document.getElementById('error').classList.remove('hidden');
});

setTimeout(() => {
	if(!document.getElementById('loading').classList.contains("hidden")) {
        document.getElementById('loading-msg').classList.remove("hidden");
    }
}, 2000);
