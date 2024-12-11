import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./TicTacToe.css";
import x_icon from "../Assets/X.png";
import o_icon from "../Assets/O.png";

let data = ["", "", "", "", "", "", "", "", ""];

export const TicTacToe = () => {
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [isResetDisabled, setIsResetDisabled] = useState(false);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [gameMode, setGameMode] = useState("solo"); // Track game mode: "solo" or "bot"

  const checkWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes("")) return "draw";

    return null;
  };

  const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === "x") return -10 + depth;
    if (winner === "o") return 10 - depth;
    if (winner === "draw") return 0;

    const availableMoves = board
      .map((val, index) => (val === "" ? index : null))
      .filter((val) => val !== null);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let move of availableMoves) {
        board[move] = "o";
        const score = minimax(board, depth + 1, false);
        board[move] = "";
        maxEval = Math.max(maxEval, score);
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let move of availableMoves) {
        board[move] = "x";
        const score = minimax(board, depth + 1, true);
        board[move] = "";
        minEval = Math.min(minEval, score);
      }
      return minEval;
    }
  };

  const toggle = (e, num) => {
    if (lock || data[num] !== "") return;

    const currentPlayer = count % 2 === 0 ? "x" : "o";

    if (currentPlayer === "o" && gameMode === "bot") {
      return; // Prevent the player from playing as "O" in bot mode
    }

    makeMove(e, num, currentPlayer);

    setCount((prevCount) => prevCount + 1);

    if (checkGameOver()) {
      setLock(true);
    } else if (gameMode === "bot" && currentPlayer === "x") {
      setLock(true); // Lock the board while the bot thinks
      setIsComputerThinking(true); // Start thinking
      setTimeout(() => {
        computerMove();
      }, 500);
    } else {
      setLock(false);
    }
  };

  const makeMove = (e, num, player) => {
    const icon = player === "x" ? x_icon : o_icon;
    const imgElement = document.createElement("img");
    imgElement.src = icon;
    imgElement.alt = player.toUpperCase();
    imgElement.draggable = false;
    e.target.appendChild(imgElement);
    data[num] = player;
  };

  const computerMove = () => {
    const availableMoves = data
      .map((val, index) => (val === "" ? index : null))
      .filter((val) => val !== null);

    let bestMove = null;
    let bestScore = -Infinity;

    for (let move of availableMoves) {
      data[move] = "o";
      const score = minimax(data, 0, false);
      data[move] = "";

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    if (bestMove !== null) {
      const box = document.querySelectorAll(".box")[bestMove];
      makeMove({ target: box }, bestMove, "o");
      setCount((prevCount) => prevCount + 1);

      if (checkGameOver()) {
        setLock(true);
      } else {
        setLock(false);
      }
    }

    setIsComputerThinking(false); // Stop thinking
  };

  const checkGameOver = () => {
    const winner = checkWinner(data);
    if (winner === "x") {
      won("x");
      return true;
    } else if (winner === "o") {
      won("o");
      return true;
    } else if (winner === "draw") {
      toast.dark("Draw!", {
        position: "top-center",
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true,
        onClose: resetGame,
        closeButton: false,
        style: {
          backgroundColor: "#1f3f40e7",
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "12px 24px",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        },
      });
      setLock(true);
      setIsResetDisabled(true); // Disable reset when game is over
      return true;
    }

    return false;
  };

  const won = (winner) => {
    toast.dark(`${winner.toUpperCase()} wins!`, {
      position: "top-center",
      autoClose: 2000,
      closeOnClick: true,
      hideProgressBar: true,
      onClose: resetGame,
      closeButton: false,
      style: {
        backgroundColor: "#1f3f40e7",
        color: "white",
        fontSize: "20px",
        fontWeight: "bold",
        textAlign: "center",
        padding: "12px 24px",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
      },
    });

    setIsResetDisabled(true); // Disable reset button after a winner is declared
  };

  const resetGame = () => {
    data = ["", "", "", "", "", "", "", "", ""];
    setCount(0);
    setLock(false);

    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
      box.classList.add("clicked");
      box.innerHTML = "";
    });

    setTimeout(() => {
      boxes.forEach((box) => {
        box.classList.remove("clicked");
      });
    }, 300);

    if (gameMode === "bot") {
      setLock(false); // Player always starts in bot mode
    }

    setIsResetDisabled(false); // Enable reset when starting new game
  };

  const handleBotGame = () => {
    setGameMode("bot");
    resetGame();
  };

  const handleSoloGame = () => {
    setGameMode("solo");
    resetGame();
  };

  return (
    <div className="container">
      <h1 className="title">Tic-Tac-Toe</h1>
      <div className="mode-buttons">
        <button
          className={`bot ${gameMode === "bot" ? "active" : ""}`}
          onClick={handleBotGame}
          disabled={isResetDisabled || isComputerThinking}
        >
          Bot
        </button>
        <button
          className={`solo ${gameMode === "solo" ? "active" : ""}`}
          onClick={handleSoloGame}
          disabled={isResetDisabled || isComputerThinking}
        >
          Solo
        </button>
      </div>
      <div className="board">
        <div className="row1">
          <div className="box" onClick={(e) => toggle(e, 0)}></div>
          <div className="box" onClick={(e) => toggle(e, 1)}></div>
          <div className="box" onClick={(e) => toggle(e, 2)}></div>
        </div>
        <div className="row2">
          <div className="box" onClick={(e) => toggle(e, 3)}></div>
          <div className="box" onClick={(e) => toggle(e, 4)}></div>
          <div className="box" onClick={(e) => toggle(e, 5)}></div>
        </div>
        <div className="row3">
          <div className="box" onClick={(e) => toggle(e, 6)}></div>
          <div className="box" onClick={(e) => toggle(e, 7)}></div>
          <div className="box" onClick={(e) => toggle(e, 8)}></div>
        </div>
      </div>
      <button className="reset" onClick={resetGame} disabled={isResetDisabled || isComputerThinking}>
        Reset
      </button>
      <ToastContainer />
    </div>
  );
};

export default TicTacToe;
