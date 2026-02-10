import './style.css';
import confetti from 'canvas-confetti';

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="media-container" id="media-container">
      <video id="main-video" autoplay loop muted playsinline preload="metadata" poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3C/svg%3E">
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

  // Swap Media with loading state
  mediaContainer.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #f7e7ce; font-size: 1.2rem;">Loading celebration... 🎉</div>`;

  // Preload the GIF with multiple fallback URLs
  const gifUrls = [
    'https://media.giphy.com/media/3rgXBxX4myufzT6N2w/giphy.gif',
    'https://media1.giphy.com/media/3rgXBxX4myufzT6N2w/giphy.gif',
    'https://media2.giphy.com/media/3rgXBxX4myufzT6N2w/giphy.gif'
  ];

  let currentUrlIndex = 0;
  const celebrationGif = new Image();

  celebrationGif.onload = () => {
    mediaContainer.innerHTML = `<img src="${celebrationGif.src}" alt="Celebration GIF" style="object-fit: cover;">`;
  };

  celebrationGif.onerror = () => {
    currentUrlIndex++;
    if (currentUrlIndex < gifUrls.length) {
      // Try next URL
      celebrationGif.src = gifUrls[currentUrlIndex];
    } else {
      // All URLs failed, show fallback message
      mediaContainer.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #f7e7ce; font-size: 2rem;">🎉 💖 ✨</div>`;
    }
  };

  // Start loading with timeout for slow connections
  celebrationGif.src = gifUrls[0];
  setTimeout(() => {
    if (!celebrationGif.complete && currentUrlIndex === 0) {
      // If still loading after 5 seconds, try next URL
      currentUrlIndex++;
      if (currentUrlIndex < gifUrls.length) {
        celebrationGif.src = gifUrls[currentUrlIndex];
      }
    }
  }, 5000);

});

// Enhanced video loading for mobile and desktop
window.addEventListener('load', () => {
  const video = document.getElementById('main-video');
  if (!video) return;

  // Detect if user is on mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Handle video loading with multiple strategies
  let hasStartedPlaying = false;

  const attemptPlay = () => {
    if (!hasStartedPlaying) {
      video.play().then(() => {
        hasStartedPlaying = true;
      }).catch(e => {
        console.log("Autoplay failed:", e);
        // On mobile, user interaction is often required
        if (isMobile) {
          document.body.addEventListener('touchstart', () => {
            video.play().catch(() => {});
          }, { once: true });
        }
      });
    }
  };

  // Strategy 1: Wait for loadeddata (lighter than canplaythrough)
  video.addEventListener('loadeddata', attemptPlay, { once: true });

  // Strategy 2: If video stalls, try to restart
  video.addEventListener('stalled', () => {
    if (!video.paused) {
      video.load();
      attemptPlay();
    }
  });

  // Strategy 3: Fallback timeout
  setTimeout(attemptPlay, 1000);

  // Prevent freezing by monitoring playback
  let lastTime = 0;
  video.addEventListener('timeupdate', () => {
    if (video.currentTime === lastTime && !video.paused && !video.ended) {
      // Video appears frozen, try to restart
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    lastTime = video.currentTime;
  });
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
