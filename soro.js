const GameModule = (function() {
    "use strict";
    let player1, player2; let _playerOneTurn = true; let _opponentIsComputer = false; let consecNumToWin;
    const _Player = (name) => {
        if (name === "Computer") {_opponentIsComputer = true}
        let _moves = [];
        const addMove = (x, y) => {_moves.push({x, y})};
        const isGameWon = () => {
            "use strict";
            let countX = {}; let countY = {};
            let vertCheck, horCheck, diagCheck;
            _moves.forEach(function (obj) {
                countX[obj.x] = !countX[obj.x] ? 1 : countX[obj.x] + 1;
                countY[obj.y] = !countY[obj.y] ? 1 : countY[obj.y] + 1;
            });
            function vertHorChecks(countXorY, choice, otherChoice) {
                let keys = Object.keys(countXorY);
                return keys.some(key => {
                    if (countXorY[key] === consecNumToWin) {
                        let corrArray = [];
                        _moves.forEach(move => {if (move[choice] === +key) {corrArray.push(move[otherChoice])}});
                        corrArray.sort((a, b) => {return a - b});
                        let count = 0;
                        for (let i = 1; i < corrArray.length; i++) {count = corrArray[i] - corrArray[i - 1] === 1 ? count + 1 : 0}
                        if (count === consecNumToWin - 1) {return true}
                    } else {return false}
                })
            }
            function diagonalChecks() {
                return _moves.some((move) => {
                    let a = move.x; let b = move.y; let diagCountL = 0; let diagCountR = 0;
                    for (let i = 1; i < consecNumToWin; i++) {
                        if (_moves.findIndex(obj => {return obj.x === a+i && obj.y === b+i;})!==-1) {diagCountL++}
                        if (_moves.findIndex(obj => {return obj.x === a+i && obj.y === b-i;})!==-1) {diagCountR++}
                    }
                    return (diagCountL === consecNumToWin-1) || (diagCountR === consecNumToWin-1);
                });
            }
            // noinspection JSSuspiciousNameCombination
            vertCheck = vertHorChecks(countX, "x", "y");
            horCheck = vertHorChecks(countY, "y", "x");
            diagCheck = diagonalChecks();
            return vertCheck || horCheck || diagCheck;
        };
        return {addMove, isGameWon}
    };
    const newGame = (opponent, consecutiveGrids) => {
        player1 = _Player("Player 1"); player2 = _Player(opponent); _playerOneTurn = true;
        consecNumToWin = consecutiveGrids;
        return _opponentIsComputer;
    };
    const playerMove = (x, y) => {
        let playerChecks = {};
        if (_playerOneTurn) {player1.addMove(+(x),+(y)); _playerOneTurn=false; playerChecks.value = "X"}
        // else if (_opponentIsComputer) {/*computer function to make a random move */}
        else {player2.addMove(+(x), +(y)); _playerOneTurn=true; playerChecks.value = "O"}
        playerChecks.isGameOver = player1.isGameWon() || player2.isGameWon();
        return playerChecks;
    };
    return {newGame, playerMove}
})();

const GameElements = (function() {
    "use strict";
    let newGameContainer = document.getElementById("newGameContainer");
    let gameContainer = document.getElementById("gameContainer");
    let friendbtn = document.getElementById("friendbtn");
    let computerbtn = document.getElementById("computerbtn");
    let beginbtn = document.getElementById("beginbtn");
    let playAgainContainer = document.getElementById("playAgainContainer");
    let restartbtn = document.getElementById("restartbtn");
    let homebtn = document.getElementById("homebtn");
    let winnerContainer = document.getElementById("winnerContainer");
    let gridSizeInput = document.getElementById("gridSize");
    let connectionSizeInput = document.getElementById("connectionSize");
    let isComputerTurn, opponentIsComputer;
    let gridSize; let consecConnections; let numOfMoves;
    //functions
    function _createGameGrid() {
        
        numOfMoves = 0;
        if (gameContainer.firstChild) return;
        let x=1; let y=1;
        let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        let btnWidth = (width - 50)/gridSize;
        btnWidth = btnWidth > 150 ? 150 : btnWidth;
        let btnHeight = (height*0.75)/gridSize;
        let sizeToUse = Math.min(btnWidth, btnHeight);
        // sizeToUse = sizeToUse < 100 ? 100 : sizeToUse;
        gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${sizeToUse}px)`;
        gameContainer.style.gridTemplateRows = `repeat(${gridSize}, ${sizeToUse}px)`;
        for (let i=0; i<gridSize**2; i++) {
            let gameButton = document.createElement('button');
            gameButton.type = "button"; _toggleClass(gameButton, "gamebtn");
            _toggleClass(gameButton, "available");
            _addTouchAndClickHandlers(gameButton, _makePlayerSelection);
            if (x > gridSize) {x = 1; y++;}
            gameButton.dataset.x = x.toString(); gameButton.dataset.y = y.toString();
            x++;
            gameContainer.appendChild(gameButton);
        }
    };
    function _clearGameGrid() {while (gameContainer.firstChild) {gameContainer.removeChild(gameContainer.firstChild)}};
    function _makePlayerSelection(e) {
        if (isComputerTurn && !e.isComputer) {return}
        let gameChecks = GameModule.playerMove(e.target.dataset.x, e.target.dataset.y);
        e.target.textContent = gameChecks.value;
        e.target.removeEventListener("touchstart click", _makePlayerSelection);
        e.target.removeEventListener('click', _makePlayerSelection);
        _toggleClass(e.target, "available");
        numOfMoves++;
        if (_isDraw()) {
            _toggleClass(winnerContainer,"divNotInUse");
            winnerContainer.textContent = "IT'S A DRAW";
            winnerContainer.style.backgroundColor = "aquamarine";
            winnerContainer.style.color = "black";
            return;
        }
        if (gameChecks.isGameOver) {
            _toggleClass(winnerContainer,"divNotInUse");
            let remainingButtons = _getActiveGridButtons();
            for (let i=0; i<remainingButtons.length; i++) {
                remainingButtons[i].removeEventListener("touchstart click", _makePlayerSelection);
                remainingButtons[i].removeEventListener('click', _makePlayerSelection);
            }
            if (gameChecks.value === "X") {
                winnerContainer.textContent = "YOU WON !!!";
                winnerContainer.style.backgroundColor ="yellow";
                winnerContainer.style.color = "firebrick";
                return;
            } else {
                winnerContainer.textContent = "YOU LOST !!!";
                winnerContainer.style.backgroundColor ="firebrick";
                winnerContainer.style.color = "yellow";
                return;
            }
        }
        if (opponentIsComputer && !e.isComputer) {
            isComputerTurn = true;
            const computerMove = setTimeout(computerRandomMove,1000);
        }
    }
    function _selectOpponent(e) {
        Array.from(document.getElementsByClassName("selected")).forEach(function(element) {
            element.classList.remove("selected");
        });
        _toggleClass(e.target, "selected");
    }
    function _beginGame() {
        if (!document.querySelector(".selected")) {alert("Please choose an opponent first"); return}
        _updateSizes();
        _toggleClass(newGameContainer,"divNotInUse");
        _toggleClass(gameContainer,"divNotInUse");
        _toggleClass(playAgainContainer, "divNotInUse");
        _toggleClass(document.querySelector("header"),"divNotInUse");
        //for now just going to pass text content. Don't know if this will need updating
        _createGameGrid();
        opponentIsComputer = GameModule.newGame(document.querySelector(".selected").textContent, consecConnections); //have to update reset game if changes made here
    }
    function _resetGame() {
        _clearGameGrid();
        _createGameGrid();
        winnerContainer.classList.add("divNotInUse");
        isComputerTurn = false;
        GameModule.newGame(document.querySelector(".selected").textContent, consecConnections);
    }
    function _addTouchAndClickHandlers(divElement,elFunction) {
        divElement.addEventListener('click', elFunction); divElement.addEventListener('touchstart click', elFunction);
    }
    function _getActiveGridButtons() {return document.getElementsByClassName("available")}
    function _updateSizes() {
        gridSize = +(gridSizeInput.value);
        document.getElementById("gridSizeDisplay").textContent = gridSize;
        consecConnections = +(connectionSizeInput.value);
        document.getElementById("connectionDisplay").textContent = consecConnections;
    }
    function _isDraw() {return numOfMoves === gridSize**2}
    function _toggleClass(div, divClass) {div.classList.toggle(divClass)}
    function computerRandomMove() {
        let arrayObj ={};
        let arrayActive = _getActiveGridButtons();
        if (arrayActive.length === 0) {return}
        arrayObj.target = arrayActive[Math.floor(Math.random() * (arrayActive.length))];
        arrayObj.isComputer = true;
        _makePlayerSelection(arrayObj);
        isComputerTurn =false;
    }
    _addTouchAndClickHandlers(friendbtn, _selectOpponent);
    _addTouchAndClickHandlers(computerbtn, _selectOpponent);
    _addTouchAndClickHandlers(beginbtn, _beginGame);
    _addTouchAndClickHandlers(restartbtn, _resetGame);
    _addTouchAndClickHandlers(homebtn, function() {location.reload()});
    gridSizeInput.addEventListener("input",_updateSizes);
    connectionSizeInput.addEventListener("input", _updateSizes);
})();