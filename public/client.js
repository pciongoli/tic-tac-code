const board = document.querySelector(".board");
const message = document.querySelector(".message");
const cells = document.querySelectorAll(".cell");

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

const resetButton = document.getElementById("reset");

resetButton.addEventListener("click", () => {
   gameState = {
      board: ["", "", "", "", "", "", "", "", ""],
      player: "X",
      winner: null,
   };
   socket.emit("gameState", gameState);
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

      // Reset the game shortly after a player wins
      setTimeout(() => {
         gameState.board = ["", "", "", "", "", "", "", "", ""];
         gameState.player = "X";
         gameState.winner = null;
         socket.emit("gameState", gameState);
      }, 1000);
   } else {
      message.classList.add("hidden");
   }
}
