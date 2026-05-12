"use strict";

//TODO: Think of this model as the game-logic.
//      The model knows everything that is neccessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.

//TODO: Prepare some customEvents. The model should dispatch events when
//      - The Player Changes
//      - A stone was inserted
//      - The Game is over (Draw or Winner)
//      Don't forget to give your events a namespace.
//      For each customEvent, just make a >method< for your model-object,
//      that, when called, dispatches the event. Nothing else should
//      happen in those methods.

//TODO: Initiate the battlefield. Your model needs a representation of the
//      battlefield as data (two-dimensional array). Obviously, there are
//      no stones yet in the field.

//TODO: The model should offer a method to insert a stone at a given column.
//      If the stone can be inserted, the model should insert the stone,
//      dispatch an event to let the world know that the battlefield has changed
//      and check if the game is over now.
//      Hint: This method will be called later by your controller, when the
//      user makes an according input.

//TODO: Methods to check if the game is over, either by draw or a win.
//      Let the world know in both cases what happend. If it's a win,
//      Don't forget to store the winning stones and add this >detail<
//      to your custom event.

//TODO: Method to change the current player (and dispatch the according event).

export let model = {
    players: ["Candace", "Vanessa"],
    currentPlayer: "Candace",
    gameOver: false,
    winner: "",
    winningStones: [],
    battleField: [
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""]
    ],

    dispatchPlayerChange: function () {
        window.dispatchEvent(new CustomEvent("c4:playerChange"));
    },

    dispatchStoneInserted: function () {
        window.dispatchEvent(new CustomEvent("c4:insertStone"));
    },

    insertStone: function (columnIndex) {
        if (this.gameOver) return;

        let stonePlaced = false;

        for (let i = 5; i >= 0; i--) {
            if (this.battleField[i][columnIndex] === "") {
                this.battleField[i][columnIndex] = this.currentPlayer;
                stonePlaced = true;

                this.dispatchStoneInserted();
                this.checkWin();

                if (!this.gameOver) {
                    this.playerChange();
                }
                break;
            }
        }

        if (stonePlaced === false) {
            window.dispatchEvent(new CustomEvent("c4:columnFull"));
        }
    },

    playerChange: function () {
        this.currentPlayer = (this.currentPlayer === "Candace") ? "Vanessa" : "Candace";
        this.dispatchPlayerChange();
    },

    checkWin: function () {
        let p = this.currentPlayer;

        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.battleField[r][c] === p &&
                    this.battleField[r][c + 1] === p &&
                    this.battleField[r][c + 2] === p &&
                    this.battleField[r][c + 3] === p) {
                    this.triggerWin(p, [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]]);
                    return;
                }
            }
        }

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 7; c++) {
                if (this.battleField[r][c] === p &&
                    this.battleField[r + 1][c] === p &&
                    this.battleField[r + 2][c] === p &&
                    this.battleField[r + 3][c] === p) {
                    this.triggerWin(p, [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]]);
                    return;
                }
            }
        }

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.battleField[r][c] === p &&
                    this.battleField[r + 1][c + 1] === p &&
                    this.battleField[r + 2][c + 2] === p &&
                    this.battleField[r + 3][c + 3] === p) {
                    this.triggerWin(p, [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]]);
                    return;
                }
            }
        }

        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.battleField[r][c] === p &&
                    this.battleField[r - 1][c + 1] === p &&
                    this.battleField[r - 2][c + 2] === p &&
                    this.battleField[r - 3][c + 3] === p) {
                    this.triggerWin(p, [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]]);
                    return;
                }
            }
        }

        let isDraw = true;
        for (let c = 0; c < 7; c++) {
            if (this.battleField[0][c] === "") {
                isDraw = false;
                break;
            }
        }

        if (isDraw) {
            this.gameOver = true;
            window.dispatchEvent(new CustomEvent("c4:gameOver", {
                detail: { winner: "draw" }
            }));
        }
    },

    triggerWin: function(winner, winningCells) {
        this.gameOver = true;
        this.winner = winner;
        this.winningStones = winningCells;

        window.dispatchEvent(new CustomEvent("c4:win", {
            detail: {
                winner: winner,
                cells: winningCells
            }
        }));
    },

    resetGame: function() {
        this.battleField = [
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""]
        ];

        this.currentPlayer = "Candace";
        this.gameOver = false;
        this.winner = "";
        this.winningStones = [];

        window.dispatchEvent(new CustomEvent("c4:gameReset"));
        this.dispatchPlayerChange();
    },
};