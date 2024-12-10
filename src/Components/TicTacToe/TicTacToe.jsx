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

  const toggle = (e, num) => {
    if (lock || data[num] !== "") {
      return; // Prevent moves on a locked board or already occupied box
    }

    const currentPlayer = count % 2 === 0 ? "x" : "o"; // Determine current player
    const icon = currentPlayer === "x" ? x_icon : o_icon;

    const imgElement = document.createElement("img");
    imgElement.src = icon;
    imgElement.alt = currentPlayer.toUpperCase();
    imgElement.draggable = false; // Properly disable dragging

    e.target.appendChild(imgElement); // Append the image directly to the box
    data[num] = currentPlayer;

    setCount((prevCount) => prevCount + 1);

    // Check if the game is over and lock the board if there's a winner
    if (checkGameOver()) {
      setLock(true);
    }
  };

  const checkGameOver = () => {
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
      if (data[a] && data[a] === data[b] && data[a] === data[c]) {
        won(data[a]);
        return true;
      }
    }

    if (!data.includes("")) {
      toast.dark("Draw!", {
        position: "top-center",
        autoClose: 2000,
      });
      setLock(true);
    }

    return false;
  };

  const won = (winner) => {
    toast.dark(`${winner.toUpperCase()} wins!`, {
      position: 'top-center',
      autoClose: 3000,
      closeOnClick: true,
      hideProgressBar:true,
      onClose: resetGame,
      closeButton: false,  // Remove the close button
      style: {
        backgroundColor: '#1f3f40e7', // Green background color
        color: 'white',              // White text color
        fontSize: '20px',            // Font size
        fontWeight: 'bold',          // Bold text
        padding: '12px 24px',        // Padding around text
        borderRadius: '10px',        // Rounded corners
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // Box shadow
      },
    });
  };
  

  const resetGame = () => {
    setCount(0);
    setLock(false);
    data = ["", "", "", "", "", "", "", "", ""]; // Reset data
    const boxes = document.querySelectorAll(".box");

    // Add the 'clicked' class to all boxes to trigger the click effect
    boxes.forEach((box) => {
      box.classList.add("clicked");
    });

    // After a short delay, remove the 'clicked' class to reset the effect
    setTimeout(() => {
      boxes.forEach((box) => {
        box.classList.remove("clicked");
      });
    }, 300); // Duration of the effect (in ms)

    boxes.forEach((box) => {
      box.innerHTML = ""; // Clear the inner HTML of each box
    });
  };

  return (
    <div className="container">
      <h1 className="title">Tic-Tac-Toe</h1>
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
      <button className="reset" onClick={resetGame}>
        Reset
      </button>
      <ToastContainer />{" "}
      {/* Add ToastContainer to render toast notifications */}
    </div>
  );
};

export default TicTacToe;
