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
      message.addEventListener(
         "animationend",
         () => {
            console.log("animationend fired"); // log message to check if event is firing
            setTimeout(() => {
               gameState = {
                  board: ["", "", "", "", "", "", "", "", ""],
                  player: "X",
                  winner: null,
               };
               console.log("gameState after reset:", gameState); // log message to check if gameState is being reset
               socket.emit("gameState", gameState);
               console.log("gameState sent to server:", gameState); // log message to check if gameState is being sent to server
            }, 1000);
         },
         { once: true }
      );
   } else {
      message.classList.add("hidden");
   }
}
