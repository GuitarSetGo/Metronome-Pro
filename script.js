// ══════════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════════

let audioCtx      = null;
let isRunning     = false;
let metroBPM      = 120;
let metroBeats    = 4;
let currentBeat   = 0;
let nextBeatTime  = 0;
let schedulerTimer = null;
let masterGain    = null;
let volumeLevel   = 0.7;

// Pendulum
let pendulumDir   = 1;
let pendulumAngle = 0;
let pendulumRAF   = null;
let lastTimestamp = null;

// Tap Tempo
let tapTimes = [];

const SCHEDULE_AHEAD     = 0.12;
const SCHEDULER_INTERVAL = 20;

// ══════════════════════════════════════════════════════════════════
// AUDIO ENGINE
// ══════════════════════════════════════════════════════════════════

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(volumeLevel, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function scheduleClick(time, isAccent) {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(masterGain);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isAccent ? 1400 : 880, time);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(isAccent ? 0.9 : 0.55, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.065);
    osc.start(time);
    osc.stop(time + 0.08);
}

function scheduler() {
    const secondsPerBeat = 60 / metroBPM;
    while (nextBeatTime < audioCtx.currentTime + SCHEDULE_AHEAD) {
        scheduleClick(nextBeatTime, currentBeat === 0);
        scheduleBeatFlash(currentBeat, nextBeatTime);
        currentBeat  = (currentBeat + 1) % metroBeats;
        nextBeatTime += secondsPerBeat;
    }
}

function scheduleBeatFlash(beat, time) {
    const delay = Math.max(0, (time - audioCtx.currentTime) * 1000);
    setTimeout(() => {
        const dots = document.querySelectorAll('.beat-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === beat));
    }, delay);
}

// ══════════════════════════════════════════════════════════════════
// METRONOME CONTROL
// ══════════════════════════════════════════════════════════════════

function startMetronome() {
    initAudio();
    currentBeat  = 0;
    nextBeatTime = audioCtx.currentTime + 0.05;
    schedulerTimer = setInterval(scheduler, SCHEDULER_INTERVAL);
    startPendulum();
    const btn = document.getElementById('startStopBtn');
    btn.textContent = '⏹ STOP';
    btn.classList.add('running');
}

function stopMetronome() {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
    stopPendulum();
    document.querySelectorAll('.beat-dot').forEach(d => d.classList.remove('active'));
    const btn = document.getElementById('startStopBtn');
    btn.textContent = '▶ START';
    btn.classList.remove('running');
}

function toggleMetronome() {
    isRunning = !isRunning;
    if (isRunning) startMetronome();
    else stopMetronome();
}

// ══════════════════════════════════════════════════════════════════
// PENDULUM ANIMATION
// ══════════════════════════════════════════════════════════════════

function startPendulum() {
    lastTimestamp = null;
    pendulumAngle = 0;
    pendulumDir   = 1;
    pendulumRAF   = requestAnimationFrame(animatePendulum);
}

function stopPendulum() {
    cancelAnimationFrame(pendulumRAF);
    pendulumRAF   = null;
    lastTimestamp = null;
    document.getElementById('pendulumArm').style.transform = 'rotate(0deg)';
}

function animatePendulum(timestamp) {
    if (!isRunning) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    const maxAngle = 28;
    const angularSpeed = (metroBPM / 60) * maxAngle * 2 * dt;

    pendulumAngle += pendulumDir * angularSpeed;

    if (pendulumAngle >= maxAngle)  { pendulumAngle = maxAngle;  pendulumDir = -1; }
    if (pendulumAngle <= -maxAngle) { pendulumAngle = -maxAngle; pendulumDir =  1; }

    document.getElementById('pendulumArm').style.transform = `rotate(${pendulumAngle}deg)`;
    pendulumRAF = requestAnimationFrame(animatePendulum);
}

// ══════════════════════════════════════════════════════════════════
// BPM CONTROLS
// ══════════════════════════════════════════════════════════════════

function changeBPM(delta) {
    metroBPM = Math.max(30, Math.min(240, metroBPM + delta));
    updateBPMDisplay();
    restartIfRunning();
}

function setBPMFromSlider(val) {
    metroBPM = parseInt(val);
    updateBPMDisplay();
    restartIfRunning();
}

function updateBPMDisplay() {
    document.getElementById('bpmDisplay').textContent = metroBPM;
    document.getElementById('bpmSlider').value = metroBPM;
    document.getElementById('tempoName').textContent = getTempoName(metroBPM);
}

function restartIfRunning() {
    if (isRunning) {
        clearInterval(schedulerTimer);
        currentBeat  = 0;
        nextBeatTime = audioCtx.currentTime + 0.05;
        schedulerTimer = setInterval(scheduler, SCHEDULER_INTERVAL);
    }
}

function getTempoName(bpm) {
    if (bpm < 40)  return 'Grave';
    if (bpm < 60)  return 'Largo';
    if (bpm < 66)  return 'Larghetto';
    if (bpm < 76)  return 'Adagio';
    if (bpm < 108) return 'Andante';
    if (bpm < 120) return 'Moderato';
    if (bpm < 156) return 'Allegro';
    if (bpm < 176) return 'Vivace';
    if (bpm < 200) return 'Presto';
    return 'Prestissimo';
}

// ══════════════════════════════════════════════════════════════════
// BEATS PER BAR
// ══════════════════════════════════════════════════════════════════

function setBeats(n) {
    metroBeats = n;
    document.querySelectorAll('.beat-select-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.textContent) === n);
    });
    buildBeatVisualizer();
    if (isRunning) currentBeat = 0;
}

function buildBeatVisualizer() {
    const viz = document.getElementById('beatVisualizer');
    viz.innerHTML = '';
    for (let i = 0; i < metroBeats; i++) {
        const d = document.createElement('div');
        d.className = 'beat-dot' + (i === 0 ? ' accent' : '');
        viz.appendChild(d);
    }
}

// ══════════════════════════════════════════════════════════════════
// VOLUME
// ══════════════════════════════════════════════════════════════════

function setVolume(val) {
    volumeLevel = parseInt(val) / 100;
    if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(volumeLevel, audioCtx.currentTime);
    }
}

// ══════════════════════════════════════════════════════════════════
// TAP TEMPO
// ══════════════════════════════════════════════════════════════════

function tapTempo() {
    const now = Date.now();
    tapTimes.push(now);
    if (tapTimes.length > 8) tapTimes.shift();

    if (tapTimes.length > 1) {
        const intervals = [];
        for (let i = 1; i < tapTimes.length; i++) {
            intervals.push(tapTimes[i] - tapTimes[i - 1]);
        }
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        metroBPM = Math.round(Math.max(30, Math.min(240, 60000 / avg)));
        updateBPMDisplay();
        restartIfRunning();
        showToast(`🎵 Tap Tempo: ${metroBPM} BPM`);
    }

    clearTimeout(tapTimes._resetTimer);
    tapTimes._resetTimer = setTimeout(() => { tapTimes = []; }, 2000);
}

// ══════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════════════════════════

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            toggleMetronome();
            break;
        case 'KeyT':
            tapTempo();
            break;
        case 'ArrowUp':
            e.preventDefault();
            changeBPM(1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeBPM(-1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeBPM(10);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeBPM(-10);
            break;
    }
});

// ══════════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════════

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// ══════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════

window.onload = () => {
    buildBeatVisualizer();
    updateBPMDisplay();
    setBeats(4);
    showToast('⌨️ Space = Start/Stop · T = Tap · ↑↓ = BPM ±1 · ←→ = BPM ±10');
};
