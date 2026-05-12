"use strict";

import { model } from './model.connectfour.js';

//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

//TODO: Update the field. Show the whole battlefield with all the stones
//      that are already played.

//TODO: Show the current player

//TODO: Notify the player when the game is over. Make it clear how the
//      Game ended. If it's a win, show the winning stones.

export let view = {

    init: function() {
        this.addEventListeners();
        this.highlightCurrentPlayer();
    },

    addEventListeners: function() {

        window.addEventListener("c4:insertStone", () => {
            this.updateBoard();
        });

        window.addEventListener("c4:playerChange", () => {
            this.highlightCurrentPlayer();
        });

        window.addEventListener("c4:gameReset", () => {
            this.updateBoard();
            this.highlightCurrentPlayer();
        });

        window.addEventListener("c4:columnFull", () => {
            alert("Column full! Choose another one!");
        });

        window.addEventListener("c4:gameOver", (event) => {
            if (event.detail.winner === "draw") {
                setTimeout(() => {
                    alert("Draw. No Winner!");
                }, 500);
            }
        });

        window.addEventListener("c4:win", (event) => {
            let winningCoords = event.detail.cells;

            winningCoords.forEach(coord => {
                let row = coord[0];
                let col = coord[1];

                let winningDiv = document.querySelectorAll(".cell-" + (col + 1))[row];
                winningDiv.classList.add("winning-stone");
            });

            setTimeout(() => {
                alert("🎉 " + event.detail.winner + " is the Winner! 🎉");
            }, 500);
        });
    },

    updateBoard: function() {

        for (let col = 0; col < 7; col++) {

            let cells = document.querySelectorAll(".cell-" + (col + 1));

            cells.forEach((div, row) => {
                let playerAtThisSpot = model.battleField[row][col];

                div.classList.remove("candace-stone", "vanessa-stone", "winning-stone");

                if (playerAtThisSpot === "Candace") {
                    div.classList.add("candace-stone");
                } else if (playerAtThisSpot === "Vanessa") {
                    div.classList.add("vanessa-stone");
                }
            });
        }
    },

    highlightCurrentPlayer: function() {
        const p1Name = document.getElementById("Candace");
        const p2Name = document.getElementById("Vanessa");

        const p1Img = document.getElementById("candace-image");
        const p2Img = document.getElementById("vanessa-image");

        [p1Name, p2Name, p1Img, p2Img].forEach(el => {
            if(el) el.classList.remove("active");
        });

        if (model.currentPlayer === "Candace") {
            if(p1Name) p1Name.classList.add("active");
            if(p1Img) p1Img.classList.add("active");
        } else {
            if(p2Name) p2Name.classList.add("active");
            if(p2Img) p2Img.classList.add("active");
        }
    }
};