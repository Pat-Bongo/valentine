import './style.css';
import confetti from 'canvas-confetti';

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="media-container" id="media-container">
      <video id="main-video" autoplay loop muted playsinline preload="auto">
        <source src="/media/vid.MP4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
    <h1 id="main-text">Oreo will you be my valentine?</h1>
    <div class="buttons">
      <button class="yes-btn" id="yes-btn">Yes! ❤️</button>
      <button class="no-btn" id="no-btn">No</button>
    </div>
  </div>
`;

const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');
const mainText = document.getElementById('main-text');
const mediaContainer = document.getElementById('media-container');

const noTexts = [
  "Are you sure?",
  "Really?",
  "Think again!",
  "Last chance!",
  "Surely not?",
  "You might regret this!",
  "Give it another thought!",
  "Are you absolutely certain?",
  "This could be a mistake!",
  "Have a heart!",
  "Don't be so cold!",
  "Change of heart?",
  "Wouldn't you reconsider?",
  "Is that your final answer?",
  "You're breaking my heart ;(",
];

let clickCount = 0;

// Evasion Logic
noBtn.addEventListener('mouseover', () => {
  moveNoButton();
});

// Mobile support
noBtn.addEventListener('click', (e) => {
  // Prevent default click on mobile if they manage to tap it
  e.preventDefault();
  moveNoButton();
});


function moveNoButton() {
  const containerRect = document.querySelector('.container').getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Get random positions within the viewport, but keep some padding
  const maxX = window.innerWidth - btnRect.width - 20;
  const maxY = window.innerHeight - btnRect.height - 20;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  noBtn.style.position = 'fixed'; // Switch to fixed to move relative to viewport
  noBtn.style.left = randomX + 'px';
  noBtn.style.top = randomY + 'px';

  // Change text
  const randomTextIndex = Math.floor(Math.random() * noTexts.length);
  noBtn.innerText = noTexts[randomTextIndex];
}

// Success Logic
yesBtn.addEventListener('click', () => {
  // Confetti
  confetti({
    spread: 100,
    particleCount: 150,
    origin: { y: 0.6 }
  });

  // Continuous confetti for a few seconds
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());

  // Update UI
  // Ensure YAY and ILY share the same style. 
  // Subtext smaller (0.25em) to fit one line and black color for visibility
  mainText.innerHTML = "YAY ILY!!! <br><span class='regular-text' style='font-size: 0.25em; display: block; margin-top: 10px; color: #000000; white-space: nowrap;'>(nilijua kienyeji wangu angesema yes)</span>";
  noBtn.style.display = 'none'; // Remove the No button
  yesBtn.style.display = 'none'; // Remove Yes button too or keep it? Plan said remove No. Let's remove both for cleaner look or just text.
  // Actually, usually we remove the buttons.

  // Swap Media
  mediaContainer.innerHTML = `<img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3b3RuMm41c3dkZXdqNHlmMnRrZ3Z5cWU3NGE5bzdqc2J0MWVraGF47ZlcD12MV9naWZzXNlYXJjaCZjdD1n/3rgXBxX4myufzT6N2w/giphy.gif" alt="Celebration GIF">`;

});

// Try to play immediately on load (muted)
window.addEventListener('load', () => {
  const video = document.getElementById('main-video');
  if (video) {
    video.play().catch(e => console.log("Autoplay failed:", e));
  }
});

// Enable sound and force play on interaction
function enableAudio() {
  const video = document.getElementById('main-video');
  if (video) {
    video.muted = false;
    video.play().catch(e => console.log("Audio play failed:", e));
  }
  // Remove listeners after first successful trigger
  ['click', 'mousemove', 'touchstart', 'keydown'].forEach(event =>
    document.body.removeEventListener(event, enableAudio)
  );
}

['click', 'mousemove', 'touchstart', 'keydown'].forEach(event =>
  document.body.addEventListener(event, enableAudio)
);
