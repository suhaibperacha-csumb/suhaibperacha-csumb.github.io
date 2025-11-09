// Matrix-style falling numbers background
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const chars = '0123456789';
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 255, 70, 0.3)'; // faint green
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}

setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

// Global variables
let randomNumber;
let attempts = 0;
let wins = 0;
let losses = 0;
const maxAttempts = 7;

// Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

// Initialize game
initializeGame();

function initializeGame() {
  randomNumber = Math.floor(Math.random() * 99) + 1;
  console.log("randomNumber: " + randomNumber);
  attempts = 0;

  document.querySelector("#playerGuess").value = "";
  document.querySelector("#guessesList").textContent = "";
  document.querySelector("#feedback").textContent = "";
  document.querySelector("#attemptsLeft").textContent = "Attempts left: " + (maxAttempts - attempts);

  document.querySelector("#guessBtn").style.display = "inline";
  document.querySelector("#resetBtn").style.display = "none";
  document.querySelector("#playerGuess").focus();
}

function checkGuess() {
  const feedback = document.querySelector("#feedback");
  const guessInput = document.querySelector("#playerGuess");
  let guess = Number(guessInput.value);

  // Validate input
  if (guess < 1 || guess > 99 || isNaN(guess)) {
    feedback.textContent = "Enter a number between 1 and 99";
    feedback.style.color = "red";
    return;
  }

  feedback.textContent = "";
  attempts++;
  document.querySelector("#guessesList").textContent += guess + " ";
  document.querySelector("#attemptsLeft").textContent = "Attempts left: " + (maxAttempts - attempts);

  if (guess === randomNumber) {
    feedback.textContent = "🎉 Correct! You guessed in " + attempts + " attempts!";
    feedback.style.color = "lime";
    wins++;
    document.querySelector("#wins").textContent = wins;
    gameOver();
  } else if (attempts >= maxAttempts) {
    feedback.textContent = "You lost! The number was " + randomNumber;
    feedback.style.color = "red";
    losses++;
    document.querySelector("#losses").textContent = losses;
    gameOver();
  } else if (guess < randomNumber) {
    feedback.textContent = "Too low! Try higher.";
    feedback.style.color = "yellow";
  } else {
    feedback.textContent = "Too high! Try lower.";
    feedback.style.color = "yellow";
  }

  guessInput.value = "";
  guessInput.focus();
}

function gameOver() {
  document.querySelector("#guessBtn").style.display = "none";
  document.querySelector("#resetBtn").style.display = "inline";
}
