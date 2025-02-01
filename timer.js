const mins = document.getElementById("mins");
const secs = document.getElementById("secs");
const startBtn = document.getElementById("startbutton");
const pauseBtn = document.getElementById("pausebutton");
const alarma = document.getElementById("alarm-sound");

let worker;



// Función para iniciar el temporizador
function startTimer() {
    let minutos = parseInt(mins.textContent);
    let segundos = parseInt(secs.textContent);
    let totalSegundos = minutos * 60 + segundos;

    if (worker) worker.terminate(); // Detener worker anterior si existe

    worker = new Worker("worker.js"); // Crear un nuevo Web Worker
    worker.postMessage({ action: "start", time: totalSegundos });

    worker.onmessage = function (e) {
        if (e.data.finished) {
            console.log("¡Tiempo terminado!");
            console.log(Date())
            worker.terminate();
            alarma.play();
        } else {
            let min = Math.floor(e.data.timeLeft / 60);
            let sec = e.data.timeLeft % 60;
            mins.textContent = min.toString().padStart(2, "0");
            secs.textContent = sec.toString().padStart(2, "0");

             // Reproducir sonido cuando llega a 00:00
    };

    startBtn.disabled = true;
    pauseBtn.disabled = false;
}
}


// Función para pausar el temporizador
function pauseTimer() {
    if (worker) {
        worker.postMessage({ action: "pause" });
        worker.terminate();
    }
    startBtn.disabled = false;
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
startBtn.click()