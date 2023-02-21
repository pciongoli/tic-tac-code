const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

server.listen(port, () => {
   console.log(`Server started on port ${port}`);
});

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/public/index.html");
});

server.listen(3000, () => {
   console.log("listening on *:3000");
});

app.use(express.static(path.join(__dirname, "public")));

let gameState = {
   board: ["", "", "", "", "", "", "", "", ""],
   player: "X",
   winner: null,
};

io.on("connection", (socket) => {
   console.log("A user has connected");

   // Send the initial game state to the new player
   socket.emit("gameState", gameState);

   // Handle incoming moves
   socket.on("move", (index) => {
      // Update the game state with the new move
      gameState.board[index] = gameState.player;

      // Check for a winner
      if (checkForWinner(gameState.board)) {
         gameState.winner = gameState.player;
      } else if (checkForTie(gameState.board)) {
         gameState.winner = "tie";
      }

      // Switch to the other player's turn
      gameState.player = gameState.player === "X" ? "O" : "X";

      // Broadcast the new game state to all players
      io.emit("gameState", gameState);
   });

   // Handle disconnections
   socket.on("disconnect", () => {
      console.log("A user has disconnected");
   });
});

function checkForWinner(board) {
   const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
   ];

   return winningCombos.some((combo) => {
      const [a, b, c] = combo;
      return board[a] && board[a] === board[b] && board[b] === board[c];
   });
}

function checkForTie(board) {
   return board.every((cell) => cell !== "");
}

server.listen(3000, () => {
   console.log("Server started on port 3000");
});
