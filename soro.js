const GameModule = (function() {
    "use strict";
    let player1, player2; let _playerOneTurn = true; let _opponentIsComputer = false;
    const _Player = (name) => {
        if (name === "Computer") {_opponentIsComputer = true}
        let _moves = [];
        const addMove = (x, y) => {_moves.push({x, y})};
        const isGameWom = () => {
            let countX = {}; let countY = {}; let countDiag = 0; let rToLDiag = 0;
            _moves.forEach(function (obj) {
                if (!countX[obj.x]) {countX[obj.x] = 1} else {countX[obj.x]++}
                if (!countY[obj.y]) {countY[obj.y] = 1} else {countY[obj.y]++}
                //don't currently have a better way of checking right to left diagonal win so the below condition
                if ((obj.x === 1 && obj.y === 3) || (obj.x === 2 && obj.y ===2) || (obj.x === 3 && obj.y ===1)) {
                    rToLDiag++
                }
                if (obj.x === obj.y) {countDiag++}
            });
            let keys = Object.keys(countX);
            // check for horizontal or vertical win
            keys.forEach(function (key) {
                if (countX[key] === 3 || countY[key] === 3) {alert("GAMEOVER!"); return true} //remove alert later
                if (rToLDiag === 3) {alert("GAMEOVER"); return true} //remove alert
                if (countDiag === 3) alert("GAMEOVER!"); //remove later
                return countDiag === 3; //check for diagonal win. Else game is not won)
            });
        };
        return {addMove, isGameWom}
    };
    const newGame = (opponent) => {
        player1 = _Player("Player 1"); player2 = _Player(opponent);
    };
    const playerMove = (x, y) => {
        if (_playerOneTurn) {player1.addMove(+(x),+(y)); player1.isGameWom(); _playerOneTurn=false; return "X"} //add a return for isGamewon or playerone won or something like that
        else if (_opponentIsComputer) {/*computer function to make a random move */}
        else if (!_playerOneTurn) {player2.addMove(+(x), +(y)); player2.isGameWom(); _playerOneTurn=true; return "O"}
    };
    return {newGame, playerMove}
})();

const GameElements = (function() {
    let gameContainer = document.getElementById("gameContainer");
    let friendbtn = document.getElementById("friendbtn");
    let computerbtn = document.getElementById("computerbtn");
    let beginbtn = document.getElementById("beginbtn");

    const createGameGrid = () => {
        if (gameContainer.firstChild) return;
        let x=1; let y=1;
        for (let i=0; i<9; i++) {
            let gameButton = document.createElement('button');
            gameButton.type = "button"; gameButton.classList.add("gamebtn");
            addTouchAndClickList(gameButton, makePlayerSelection);
            if (x > 3) {x = 1; y++;}
            gameButton.dataset.x = x.toString(); gameButton.dataset.y = y.toString();
            x++;
            gameContainer.appendChild(gameButton);
        }
    };
    const clearGameGrid = () => {while (gameContainer.firstChild) {gameContainer.removeChild(gameContainer.firstChild)}};
    function makePlayerSelection(e) {
        e.target.textContent = GameModule.playerMove(e.target.dataset.x, e.target.dataset.y);
    }
    function selectOpponent(e) {
        Array.from(document.getElementsByClassName("selected")).forEach(function(element) {
            element.classList.remove("selected");
        });
        e.target.classList.add("selected");
    }
    function beginGame() {
        //for now just going to pass text content. Don't know if this will need updating
        GameModule.newGame(document.querySelector(".selected").textContent);
    }
    function addTouchAndClickList(divElement,elFunction) {
        divElement.addEventListener('click', elFunction); divElement.addEventListener('touchstart', elFunction);
    }
    addTouchAndClickList(friendbtn, selectOpponent);
    addTouchAndClickList(computerbtn, selectOpponent);
    addTouchAndClickList(beginbtn, beginGame);

    return {createGameGrid, clearGameGrid}
})();

GameElements.createGameGrid();