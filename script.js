/* ============================================================
   CUSTOMIZE HERE
   ============================================================ */
const RECIPIENT_NAME = "JabbarAhmed"; // e.g. "Sarah" — used in the wish text below
const WISH_TEXT = `Another year of you, and I still can't quite believe my luck.

Out of everyone, out of everywhere I could have ended up, I ended up here — knowing you, loved by you, building something with you that feels rarer than I ever expected to find. I don't say it enough, but I notice it every day: the way you show up for people, the way you think before you speak, the quiet steadiness you carry that makes everything around you feel a little safer, a little softer.

I adore you. Not just today, not just because it's your birthday — but in the ordinary, unremarkable Tuesdays too, in the small moments no one else sees. You make the everyday feel worth paying attention to.

So today, I hope you feel exactly how loved you are. I hope you look back on this year and feel proud of who you've become, and I hope this next one brings you everything you've been quietly hoping for — and then some.

Happy birthday, Jaybeee. Thank you for being you. I'm so lucky to have you in my life.`;

/* If you have your own MP3, drop it in this folder and set the path below.
   Leave as null to use the built-in synthesized melody instead. */
const CUSTOM_AUDIO_PATH = "music.mp3"; // rename to match your actual mp3 filename

/* ============================================================
   SPARKLES (canvas)
   ============================================================ */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let sparkles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function makeSparkle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 0.6 + Math.random() * 1.6,
    baseAlpha: 0.15 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    speed: 0.01 + Math.random() * 0.02,
    color: Math.random() > 0.5 ? '232,206,134' : '201,191,232'
  };
}

const SPARKLE_COUNT = 90;
for (let i = 0; i < SPARKLE_COUNT; i++) sparkles.push(makeSparkle());

let t = 0;
function drawSparkles() {
  t += 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sparkles.forEach(s => {
    const twinkle = Math.sin(t * s.speed + s.phase) * 0.5 + 0.5;
    const alpha = s.baseAlpha * twinkle;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${s.color},${alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawSparkles);
}
drawSparkles();

/* ============================================================
   FLOATING NEON HEARTS
   ============================================================ */
const heartsLayer = document.getElementById('hearts-layer');

function heartSVG(color, glow) {
  return `<svg width="${20}" height="${20}" viewBox="0 0 32 29.6" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.6 0c-3.3 0-6.2 1.9-7.6 4.8C14.6 1.9 11.7 0 8.4 0 3.8 0 0 3.8 0 8.4c0 8.1 8.6 13.4 16 20.7 7.4-7.3 16-12.5 16-20.7C32 3.8 28.2 0 23.6 0z"
      fill="none" stroke="${color}" stroke-width="1.4" />
  </svg>`;
}

function spawnHeart() {
  const el = document.createElement('div');
  el.className = 'heart';
  const isGold = Math.random() > 0.45;
  el.innerHTML = heartSVG(isGold ? '#e8ce86' : '#c9bfe8');

  const left = 4 + Math.random() * 92;
  const duration = 9 + Math.random() * 7;
  const scale = 0.6 + Math.random() * 1.1;
  const drift = (Math.random() * 60 - 30) + 'px';
  const rot = (Math.random() * 16 - 8) + 'deg';
  const opacity = 0.35 + Math.random() * 0.4;

  el.style.left = left + '%';
  el.style.setProperty('--s', scale);
  el.style.setProperty('--drift', drift);
  el.style.setProperty('--rot', rot);
  el.style.setProperty('--o', opacity);
  el.style.animationDuration = duration + 's';

  heartsLayer.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000 + 200);
}

setInterval(spawnHeart, 900);
for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 400);

/* ============================================================
   TYPEWRITER REVEAL
   ============================================================ */
const seal = document.getElementById('seal');
const letter = document.getElementById('letter');
const typedEl = document.getElementById('typed-text');
const cursorEl = document.getElementById('cursor');
const soundToggle = document.getElementById('sound-toggle');

function typeWriter(text, el, speed = 28) {
  let i = 0;
  function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      el.appendChild(cursorEl);
      i++;
      const char = text[i - 1];
      const pause = (char === '.' || char === ',') ? speed * 6 : speed;
      setTimeout(step, pause + Math.random() * 18);
    }
  }
  step();
}

function openLetter() {
  seal.classList.add('hidden');
  startMusic();

  setTimeout(() => {
    letter.classList.add('visible');
    letter.setAttribute('aria-hidden', 'false');
    typeWriter(WISH_TEXT, typedEl);
    soundToggle.classList.add('visible');
  }, 500);
}

seal.addEventListener('click', openLetter);

/* ============================================================
   MUSIC — custom mp3 if provided, otherwise a synthesized
   soft "Happy Birthday" melody (public-domain tune) via
   the Web Audio API. No external audio file required.
   ============================================================ */
let audioCtx = null;
let audioEl = null;
let musicPlaying = false;
let melodyTimeouts = [];

const NOTE_FREQ = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
  D5: 587.33, E5: 659.25, F5: 698.46
};

// "Happy Birthday to You" — melody + beat duration (in quarter notes)
const MELODY = [
  ['C4', 0.75], ['C4', 0.25], ['D4', 1], ['C4', 1], ['F4', 1], ['E4', 2],
  ['C4', 0.75], ['C4', 0.25], ['D4', 1], ['C4', 1], ['G4', 1], ['F4', 2],
  ['C4', 0.75], ['C4', 0.25], ['C5', 1], ['A4', 1], ['F4', 1], ['E4', 1], ['D4', 2],
  ['F5', 0.75], ['F5', 0.25], ['E4', 1], ['F4', 1], ['G4', 1], ['F4', 2]
];

function playSynthMelody(loop = true) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const beat = 0.5; // seconds per quarter note — slow and soft
  let time = audioCtx.currentTime + 0.1;
  const noteGap = 0.03;

  MELODY.forEach(([note, dur]) => {
    const freq = NOTE_FREQ[note];
    const length = dur * beat;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.06, time + 0.08);
    gain.gain.linearRampToValueAtTime(0.05, time + length * 0.6);
    gain.gain.linearRampToValueAtTime(0, time + length - noteGap);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + length);

    time += length;
  });

  const totalDuration = MELODY.reduce((sum, [, d]) => sum + d, 0) * beat;

  if (loop) {
    const id = setTimeout(() => {
      if (musicPlaying) playSynthMelody(true);
    }, (totalDuration + 1.2) * 1000);
    melodyTimeouts.push(id);
  }
}

function stopSynthMelody() {
  melodyTimeouts.forEach(id => clearTimeout(id));
  melodyTimeouts = [];
}

function startMusic() {
  musicPlaying = true;
  soundToggle.classList.remove('muted');

  if (CUSTOM_AUDIO_PATH) {
    audioEl = new Audio(CUSTOM_AUDIO_PATH);
    audioEl.loop = true;
    audioEl.volume = 0.5;
    audioEl.play().catch(() => {
      // Autoplay blocked — will resume on sound-toggle click
      musicPlaying = false;
    });
  } else {
    playSynthMelody(true);
  }
}

function toggleMusic() {
  if (musicPlaying) {
    musicPlaying = false;
    soundToggle.classList.add('muted');
    if (audioEl) audioEl.pause();
    stopSynthMelody();
  } else {
    musicPlaying = true;
    soundToggle.classList.remove('muted');
    if (audioEl) {
      audioEl.play().catch(() => {});
    } else {
      playSynthMelody(true);
    }
  }
}

soundToggle.addEventListener('click', toggleMusic);
