// Game State Management
let gameState = {
  currentGame: 'menu',
  achievements: {
    memory: false,
    puzzle: false,
    word: false
  },
  memory: {
    level: 1,
    score: 0,
    sequence: [],
    playerSequence: [],
    isPlaying: false,
    showingSequence: false
  },
  puzzle: {
    tiles: [],
    moves: 0,
    bestScore: localStorage.getItem('puzzleBest') || null
  },
  word: {
    level: 1,
    score: 0,
    currentWord: '',
    scrambledWord: '',
    hint: '',
    isCorrect: false
  }
};

// Love words for word game
const loveWords = [
  { word: 'ANANYA', hint: 'Your beautiful name! 💕' },
  { word: 'LOVE', hint: 'What I feel for you! ❤️' },
  { word: 'HEART', hint: 'Where you live! 💓' },
  { word: 'SMILE', hint: 'What you give me! 😊' },
  { word: 'BEAUTIFUL', hint: 'What you are! 🌸' },
  { word: 'FOREVER', hint: 'How long I will love you! ♾️' },
  { word: 'SUNSHINE', hint: 'You are my... ☀️' },
  { word: 'PRECIOUS', hint: 'What you are to me! 💎' },
  { word: 'AMAZING', hint: 'Another word for you! ✨' },
  { word: 'PERFECT', hint: 'Exactly what you are! 🌟' }
];

// Love messages for puzzle
const loveMessages = [
  "You're my sunshine 🌞",
  "Beautiful Ananya 🌸",
  "My heart beats for you 💓",
  "You make me smile 😊",
  "Forever yours 💕",
  "You're amazing ✨",
  "Love you always 💖",
  "You're perfect 🌟",
  "My everything 💝"
];

// Initialize the app
function init() {
  createBackgroundHearts();
  showScreen('menu');
  updateAchievements();
}

// Create floating background hearts
function createBackgroundHearts() {
  const container = document.getElementById('background-hearts');
  container.innerHTML = '';
  
  for (let i = 0; i < 20; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '♡';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = Math.random() * 100 + '%';
    heart.style.animationDelay = Math.random() * 3 + 's';
    heart.style.animationDuration = (2 + Math.random() * 2) + 's';
    container.appendChild(heart);
  }
}

// Show specific screen
function showScreen(screen) {
  // Hide all screens
  const screens = ['menu', 'memory-game', 'puzzle-game', 'word-game', 'completion'];
  screens.forEach(screenName => {
    const element = document.getElementById(screenName + '-screen');
    if (element) {
      element.classList.remove('active');
    }
  });

  // Show selected screen
  const targetScreen = document.getElementById(screen + '-screen');
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
  
  gameState.currentGame = screen;
}

// Navigation functions
function startMemoryGame() {
  showScreen('memory-game');
}

function startPuzzleGame() {
  showScreen('puzzle-game');
}

function startWordGame() {
  showScreen('word-game');
}

function backToMenu() {
  showScreen('menu');
  updateAchievements();
  
  // Reset game states
  document.getElementById('memory-game-start').classList.remove('hidden');
  document.getElementById('memory-game-play').classList.add('hidden');
  document.getElementById('puzzle-game-start').classList.remove('hidden');
  document.getElementById('puzzle-game-play').classList.add('hidden');
  document.getElementById('word-game-start').classList.remove('hidden');
  document.getElementById('word-game-play').classList.add('hidden');
}

// Achievement system
function updateAchievements() {
  const achievementContainer = document.getElementById('achievement-list');
  const achievementSection = document.getElementById('achievements');
  
  let hasAchievements = false;
  achievementContainer.innerHTML = '';

  if (gameState.achievements.memory) {
    hasAchievements = true;
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.innerHTML = `
      <div class="achievement-icon">❤️</div>
      <div class="achievement-label">Memory Heart</div>
    `;
    achievementContainer.appendChild(achievement);
  }

  if (gameState.achievements.puzzle) {
    hasAchievements = true;
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.innerHTML = `
      <div class="achievement-icon">💝</div>
      <div class="achievement-label">Puzzle Heart</div>
    `;
    achievementContainer.appendChild(achievement);
  }

  if (gameState.achievements.word) {
    hasAchievements = true;
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.innerHTML = `
      <div class="achievement-icon">💖</div>
      <div class="achievement-label">Word Heart</div>
    `;
    achievementContainer.appendChild(achievement);
  }

  if (hasAchievements) {
    achievementSection.classList.remove('hidden');
  } else {
    achievementSection.classList.add('hidden');
  }
}

// Memory Game Functions
function initMemoryGame() {
  document.getElementById('memory-game-start').classList.add('hidden');
  document.getElementById('memory-game-play').classList.remove('hidden');
  
  gameState.memory = {
    level: 1,
    score: 0,
    sequence: [],
    playerSequence: [],
    isPlaying: false,
    showingSequence: false
  };
  
  updateMemoryDisplay();
  generateMemorySequence();
}

function generateMemorySequence() {
  const sequence = [];
  for (let i = 0; i < gameState.memory.level; i++) {
    sequence.push(Math.floor(Math.random() * 4));
  }
  gameState.memory.sequence = sequence;
  gameState.memory.playerSequence = [];
  playMemorySequence();
}

async function playMemorySequence() {
  gameState.memory.showingSequence = true;
  gameState.memory.isPlaying = false;
  
  const statusElement = document.getElementById('memory-status');
  statusElement.textContent = 'Watch carefully... ✨';
  statusElement.className = 'game-status';
  
  const buttons = document.querySelectorAll('.memory-button');
  buttons.forEach(btn => btn.disabled = true);

  for (let i = 0; i < gameState.memory.sequence.length; i++) {
    await sleep(1000);
    const buttonIndex = gameState.memory.sequence[i];
    const button = buttons[buttonIndex];
    button.classList.add('active');
    await sleep(800);
    button.classList.remove('active');
  }
  
  gameState.memory.showingSequence = false;
  gameState.memory.isPlaying = true;
  
  statusElement.textContent = 'Your turn! Repeat the sequence 🎯';
  buttons.forEach(btn => btn.disabled = false);
}

function memoryButtonClick(index) {
  if (gameState.memory.showingSequence || !gameState.memory.isPlaying) return;

  gameState.memory.playerSequence.push(index);
  
  const currentIndex = gameState.memory.playerSequence.length - 1;
  if (gameState.memory.playerSequence[currentIndex] !== gameState.memory.sequence[currentIndex]) {
    // Game over
    gameState.memory.isPlaying = false;
    alert('Oops! Try again, Ananya! 💕');
    initMemoryGame();
    return;
  }

  if (gameState.memory.playerSequence.length === gameState.memory.sequence.length) {
    // Level completed
    gameState.memory.score += gameState.memory.level * 10;
    gameState.memory.isPlaying = false;
    
    const statusElement = document.getElementById('memory-status');
    statusElement.textContent = 'Perfect! Level completed! 🎉';
    statusElement.className = 'game-status success';
    
    if (gameState.memory.level >= 3) {
      // Game completed!
      setTimeout(() => {
        completeMemoryGame();
      }, 1000);
    } else {
      // Next level
      setTimeout(() => {
        gameState.memory.level++;
        updateMemoryDisplay();
        generateMemorySequence();
      }, 1500);
    }
  }
}

function updateMemoryDisplay() {
  document.getElementById('memory-level').textContent = gameState.memory.level;
  document.getElementById('memory-score').textContent = gameState.memory.score;
  document.getElementById('memory-progress').textContent = gameState.memory.level;
  document.getElementById('memory-progress-bar').style.width = (gameState.memory.level / 3) * 100 + '%';
}

function completeMemoryGame() {
  gameState.achievements.memory = true;
  showHeartReward('I Love You Ananya! 💕', "You're amazing at remembering! ❤️");
}

// Puzzle Game Functions
function initPuzzleGame() {
  document.getElementById('puzzle-game-start').classList.add('hidden');
  document.getElementById('puzzle-game-play').classList.remove('hidden');
  
  gameState.puzzle.moves = 0;
  initializePuzzle();
  updatePuzzleDisplay();
  renderPuzzle();
}

function initializePuzzle() {
  // Start with solved state
  const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
  numbers.push(0); // Empty space

  // Generate solvable puzzle by making random valid moves from solved state
  let currentTiles = [...numbers];
  let emptyPos = 8; // Empty space starts at position 8

  // Make 1000 random valid moves to shuffle
  for (let i = 0; i < 1000; i++) {
    const validMoves = [];
    const row = Math.floor(emptyPos / 3);
    const col = emptyPos % 3;

    // Check all four directions
    if (row > 0) validMoves.push(emptyPos - 3); // Up
    if (row < 2) validMoves.push(emptyPos + 3); // Down
    if (col > 0) validMoves.push(emptyPos - 1); // Left
    if (col < 2) validMoves.push(emptyPos + 1); // Right

    // Pick random valid move
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

    // Swap empty space with selected tile
    [currentTiles[emptyPos], currentTiles[randomMove]] = [currentTiles[randomMove], currentTiles[emptyPos]];
    emptyPos = randomMove;
  }

  gameState.puzzle.tiles = currentTiles;
}

function renderPuzzle() {
  const grid = document.getElementById('puzzle-grid');
  grid.innerHTML = '';

  gameState.puzzle.tiles.forEach((tile, index) => {
    const tileElement = document.createElement('div');
    
    if (tile === 0) {
      tileElement.className = 'puzzle-tile empty';
    } else {
      tileElement.className = 'puzzle-tile';
      tileElement.innerHTML = `
        <div class="puzzle-tile-number">${tile}</div>
        <div class="puzzle-tile-message">
          ${loveMessages[tile - 1]}
        </div>
      `;
      
      if (canMovePuzzleTile(index)) {
        tileElement.style.cursor = 'pointer';
        tileElement.onclick = () => movePuzzleTile(index);
      }
    }

    grid.appendChild(tileElement);
  });
}

function canMovePuzzleTile(index) {
  const emptyIndex = gameState.puzzle.tiles.indexOf(0);
  const row = Math.floor(index / 3);
  const col = index % 3;
  const emptyRow = Math.floor(emptyIndex / 3);
  const emptyCol = emptyIndex % 3;

  return (
    (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
    (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  );
}

function movePuzzleTile(index) {
  if (!canMovePuzzleTile(index)) return;

  const emptyIndex = gameState.puzzle.tiles.indexOf(0);
  
  // Swap tiles
  [gameState.puzzle.tiles[index], gameState.puzzle.tiles[emptyIndex]] = 
  [gameState.puzzle.tiles[emptyIndex], gameState.puzzle.tiles[index]];

  gameState.puzzle.moves++;
  updatePuzzleDisplay();
  renderPuzzle();

  // Check if puzzle is solved
  const isSolved = gameState.puzzle.tiles.slice(0, 8).every((tile, index) => tile === index + 1);
  if (isSolved) {
    if (!gameState.puzzle.bestScore || gameState.puzzle.moves < gameState.puzzle.bestScore) {
      gameState.puzzle.bestScore = gameState.puzzle.moves;
      localStorage.setItem('puzzleBest', gameState.puzzle.bestScore);
      updatePuzzleDisplay();
    }

    const statusElement = document.getElementById('puzzle-status');
    statusElement.textContent = `Perfect! You solved it in ${gameState.puzzle.moves} moves! 🎉`;
    statusElement.className = 'game-status success';

    setTimeout(() => {
      completePuzzleGame();
    }, 1500);
  }
}

function updatePuzzleDisplay() {
  document.getElementById('puzzle-moves').textContent = gameState.puzzle.moves;
  document.getElementById('puzzle-best').textContent = gameState.puzzle.bestScore || '-';
}

function resetPuzzle() {
  gameState.puzzle.moves = 0;
  initializePuzzle();
  updatePuzzleDisplay();
  renderPuzzle();
  document.getElementById('puzzle-status').textContent = '';
  document.getElementById('puzzle-status').className = 'game-status';
}

function completePuzzleGame() {
  gameState.achievements.puzzle = true;
  showHeartReward('I Love You Ananya Forever! 💕', 'This heart will beat for you always! ❤️');
}

// Word Game Functions
function initWordGame() {
  document.getElementById('word-game-start').classList.add('hidden');
  document.getElementById('word-game-play').classList.remove('hidden');
  
  gameState.word = {
    level: 1,
    score: 0,
    currentWord: '',
    scrambledWord: '',
    hint: '',
    isCorrect: false
  };
  
  updateWordDisplay();
  loadNewWord();
}

function loadNewWord() {
  const wordObj = loveWords[Math.min(gameState.word.level - 1, loveWords.length - 1)];
  gameState.word.currentWord = wordObj.word;
  gameState.word.hint = wordObj.hint;
  gameState.word.scrambledWord = scrambleWord(wordObj.word);
  gameState.word.isCorrect = false;
  
  document.getElementById('scrambled-word').textContent = gameState.word.scrambledWord;
  document.getElementById('word-hint').textContent = gameState.word.hint;
  document.getElementById('word-hint-display').textContent = `Hint: ${gameState.word.hint} 💡`;
  
  const input = document.getElementById('word-input');
  input.value = '';
  input.disabled = false;
  
  const status = document.getElementById('word-status');
  status.classList.add('hidden');
  status.className = 'game-status success hidden';
}

function scrambleWord(word) {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join('');
}

function checkWordAnswer() {
  const userInput = document.getElementById('word-input').value.toUpperCase();
  
  if (userInput === gameState.word.currentWord) {
    gameState.word.isCorrect = true;
    gameState.word.score += gameState.word.level * 10;
    
    const statusElement = document.getElementById('word-status');
    statusElement.textContent = 'Perfect! You got it right! 🎉';
    statusElement.className = 'game-status success';
    statusElement.classList.remove('hidden');
    
    document.getElementById('word-input').disabled = true;
    
    updateWordDisplay();
    
    setTimeout(() => {
      if (gameState.word.level >= 10) {
        completeWordGame();
      } else {
        gameState.word.level++;
        updateWordDisplay();
        loadNewWord();
      }
    }, 1500);
  } else {
    document.getElementById('word-input').value = '';
    alert('Try again, Ananya! You can do it! 💕');
  }
}

function handleWordKeyPress(event) {
  if (event.key === 'Enter') {
    checkWordAnswer();
  }
}

function updateWordDisplay() {
  document.getElementById('word-level').textContent = gameState.word.level;
  document.getElementById('word-score').textContent = gameState.word.score;
  document.getElementById('word-progress').textContent = gameState.word.level;
  document.getElementById('word-progress-bar').style.width = (gameState.word.level / 10) * 100 + '%';
}

function completeWordGame() {
  gameState.achievements.word = true;
  showHeartReward('I Love You Ananya! 💕', "You're brilliant with words! ❤️");
}

// Heart Reward System
function showHeartReward(title, message) {
  document.getElementById('heart-reward-title').textContent = title;
  document.getElementById('heart-reward-message').textContent = message;
  
  // Create floating sparkles
  const sparklesContainer = document.getElementById('heart-sparkles');
  sparklesContainer.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'floating-sparkle';
    sparkle.textContent = '✨';
    sparkle.style.left = (Math.random() * 600 - 300) + 'px';
    sparkle.style.top = (Math.random() * 600 - 300) + 'px';
    sparkle.style.animationDelay = Math.random() * 3 + 's';
    sparkle.style.animationDuration = (1 + Math.random() * 2) + 's';
    sparklesContainer.appendChild(sparkle);
  }

  // Create floating hearts
  const heartsContainer = document.getElementById('heart-floating-hearts');
  heartsContainer.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart-element';
    heart.textContent = '💕';
    heart.style.left = (Math.random() * 400 - 200) + 'px';
    heart.style.top = (Math.random() * 400 - 200) + 'px';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heart.style.animationDuration = (2 + Math.random()) + 's';
    heartsContainer.appendChild(heart);
  }

  // Show reward overlay
  const overlay = document.getElementById('heart-reward');
  overlay.classList.add('visible');
  
  // Hide after 5 seconds and show completion screen
  setTimeout(() => {
    overlay.classList.remove('visible');
    showCompletionScreen();
  }, 5000);
}

function showCompletionScreen() {
  let message = "Here's your special heart with love...";
  
  if (gameState.achievements.memory && !gameState.achievements.puzzle && !gameState.achievements.word) {
    message = "You mastered the memory challenge! " + message;
  } else if (gameState.achievements.puzzle && !gameState.achievements.memory && !gameState.achievements.word) {
    message = "You solved the love puzzle perfectly! " + message;
  } else if (gameState.achievements.word && !gameState.achievements.memory && !gameState.achievements.puzzle) {
    message = "You unscrambled all the love words! " + message;
  } else {
    message = "You're amazing at games! " + message;
  }
  
  document.getElementById('completion-message').textContent = message;
  showScreen('completion');
}

// Utility function for async delays
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize the app when page loads
window.addEventListener('DOMContentLoaded', init);

// Handle window resize for responsive background hearts
window.addEventListener('resize', () => {
  createBackgroundHearts();
});
