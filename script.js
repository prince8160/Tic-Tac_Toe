let currentPlayer = "X";
let board = Array(9).fill("");
let gameActive = false;
let playerNames = { X: "Player 1", O: "Player 2" };
const statusDiv = document.getElementById("status");

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function startGame() {
  const p1 = document.getElementById("player1").value || "Player 1";
  const p2 = document.getElementById("player2").value || "Player 2";
  playerNames = { X: p1, O: p2 };
  board.fill("");
  currentPlayer = "X";
  gameActive = true;
  updateStatus();
  updateBoard();
}

function updateStatus() {
  statusDiv.textContent = `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = board[i];
    cell.onclick = () => handleCellClick(i);
  });
}

function handleCellClick(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  updateBoard();

  if (checkWin()) {
    statusDiv.textContent = `${playerNames[currentPlayer]} Wins!`;
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusDiv.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();

  // Smart AI if O's turn
  if (currentPlayer === "O") {
    setTimeout(() => smartAIMove(), 500);
  }
}

function smartAIMove() {
  const move = getBestMove();
  handleCellClick(move);
}

function getBestMove() {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = currentPlayer;
      if (checkWin()) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // Try to block
  const opponent = currentPlayer === "X" ? "O" : "X";
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = opponent;
      if (checkWin()) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // Else pick center, corner, side
  const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  return preferred.find(i => board[i] === "");
}

function checkWin() {
  return winPatterns.some(pattern => 
    pattern.every(i => board[i] === currentPlayer)
  );
}

function resetGame() {
  board.fill("");
  gameActive = true;
  currentPlayer = "X";
  updateStatus();
  updateBoard();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Init on load
updateBoard();