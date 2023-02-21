const board = document.querySelector(".board");
const message = document.querySelector(".message");
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset-button");

let gameState;

const socket = io("https://tic-tac-code.herokuapp.com/");
// const socket = io("http://localhost:3000/");

socket.on("connect", () => {
   console.log("Connected to server");
});

socket.on("gameState", (state) => {
   gameState = state;
   render();
});

board.addEventListener("click", (event) => {
   if (event.target.classList.contains("cell")) {
      const index = event.target.dataset.index;
      if (gameState.board[index] === "" && !gameState.winner) {
         socket.emit("move", index);
      }
   }
});

resetButton.addEventListener("click", () => {
   socket.emit("reset");
});

function render() {
   for (let i = 0; i < gameState.board.length; i++) {
      cells[i].textContent = gameState.board[i];
   }

   if (gameState.winner) {
      if (gameState.winner === "tie") {
         message.textContent = "It's a tie!";
      } else {
         message.textContent = `Player ${gameState.winner} wins!`;
      }
      message.classList.remove("hidden");
   } else {
      // Update the player turn message
      const playerTurnMessage = document.querySelector(".player-turn");
      if (gameState.player === "X") {
         playerTurnMessage.textContent = "Player X make your move!";
      } else {
         playerTurnMessage.textContent = "Player O make your move!";
      }
      message.classList.add("hidden");
   }
}
