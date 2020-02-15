const GameModule = (function() {
    "use strict";
    let player1, player2; let _playerOneTurn = true; let _opponentIsComputer = false; let consecNumToWin;
    const _Player = (name) => {
        if (name === "Computer") {_opponentIsComputer = true}
        let _moves = [];
        const addMove = (x, y) => {_moves.push({x, y})};
        const isGameWon = () => {
            "use strict";
            let countX = {}; let countY = {}; // let countDiag = 0; let rToLDiag = 0; values for old checks.
            let vertCheck, horCheck, leftRightDiagCheck, rightLeftDiagCheck;
            _moves.forEach(function (obj) {
                countX[obj.x] = !countX[obj.x] ? 1 : countX[obj.x] + 1;
                countY[obj.y] = !countY[obj.y] ? 1 : countY[obj.y] + 1;
                /*  if ((obj.x === 1 && obj.y === 3) || (obj.x === 2 && obj.y ===2) || (obj.x === 3 && obj.y ===1)) {
                    rToLDiag++
                }
                if (obj.x === obj.y) {countDiag++} */
            });
            // old check for horizontal or vertical win
            /* keys.forEach(function (key) {if (countX[key] === 3 || countY[key] === 3) {vertHor = true}});
            return rToLDiag === 3 || countDiag === 3 || vertHor; */

            // New Check for Vertical Win

            let keysX = Object.keys(countX);
            vertCheck = keysX.some(key => {
                if (countX[key] == consecNumToWin) {
                    let corrYArray = [];
                    _moves.forEach(move => {if (move.x == key) {corrYArray.push(move.y)}}); //add all the corresponding y values
                    corrYArray.sort((a,b) => {return a - b});
                    let vertCount = 0;
                    for (let i=1; i<corrYArray.length; i++) {vertCount = corrYArray[i]-corrYArray[i-1]===1?vertCount+1:0}
                    if (vertCount === consecNumToWin-1) {vertCheck = true}
                    }
                return vertCheck;
                });
            // New Check for Horizontal Win. Later fix this duplicate code. Be careful of the opposite move value.
            let keysY = Object.keys(countY);
            horCheck = keysY.some(key => {
                if (countY[key] == consecNumToWin) {
                    let corrXArray = [];
                    _moves.forEach(move => {if (move.y == key) {corrXArray.push(move.x)}}); //add all the corresponding y values
                    corrXArray.sort((a,b) => {return a - b});
                    let horCount = 0;
                    for (let i=1; i<corrXArray.length; i++) {horCount = corrXArray[i]-corrXArray[i-1]===1?horCount+1:0}
                    if (horCount === consecNumToWin-1) {horCheck = true}
                }
                return horCheck;
            });
            //New Check for Left to Right diagonal win
            _moves.sort((a,b) => a.y - b.y);
            leftRightDiagCheck = _moves.some((move) => {
                let a = move.x; let b = move.y; let diagCount = 0;
                for (let i = 1; i < consecNumToWin; i++) {
                    if (_moves.findIndex(obj => {return obj.x === a+i && obj.y === b+i;})!==-1) {diagCount++}
                }
                return diagCount === consecNumToWin-1;
            });
            //New Check for Right to Left diagonal win
            _moves.sort((a,b) => a.x - b.x);
            rightLeftDiagCheck = _moves.some((move) => {
                let a = move.x; let b = move.y; let diagCount = 0;
                for (let i = 1; i < consecNumToWin; i++) {
                    if (_moves.findIndex(obj => {return obj.x === a+i && obj.y === b-i;})!==-1) {diagCount++}
                }
                return diagCount === consecNumToWin-1;
            });
            return vertCheck || horCheck || leftRightDiagCheck || rightLeftDiagCheck;
        };
        return {addMove, isGameWon: isGameWon}
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

    // temporary, remove after you create elements for grid size and consecutive number to win
    let gridSize = 3; let consecConnections = 3; let numOfMoves;

    function _toggleClass(div, divClass) {div.classList.toggle(divClass)}

    const createGameGrid = () => {
        numOfMoves = 0;
        if (gameContainer.firstChild) return;
        let x=1; let y=1;
        let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        let btnWidth = (width - 50)/gridSize;
        btnWidth = btnWidth > 150 ? 150 : btnWidth;
        let btnHeight = (height*0.75)/gridSize;
        let sizeToUse = Math.min(btnWidth, btnHeight);
        sizeToUse = sizeToUse < 100 ? 100 : sizeToUse;

        gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${sizeToUse}px)`;
        gameContainer.style.gridTemplateRows = `repeat(${gridSize}, ${sizeToUse}px)`;
        for (let i=0; i<gridSize**2; i++) {
            let gameButton = document.createElement('button');
            gameButton.type = "button"; _toggleClass(gameButton, "gamebtn");
            _toggleClass(gameButton, "available");
            addTouchAndClickList(gameButton, makePlayerSelection);
            if (x > gridSize) {x = 1; y++;}
            gameButton.dataset.x = x.toString(); gameButton.dataset.y = y.toString();
            x++;
            gameContainer.appendChild(gameButton);
        }
    };
    const clearGameGrid = () => {while (gameContainer.firstChild) {gameContainer.removeChild(gameContainer.firstChild)}};
    function makePlayerSelection(e) {
        if (isComputerTurn && !e.isComputer) {return}
        let gameChecks = GameModule.playerMove(e.target.dataset.x, e.target.dataset.y);
        e.target.textContent = gameChecks.value;
        e.target.removeEventListener("touchstart click", makePlayerSelection);
        e.target.removeEventListener('click', makePlayerSelection);
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
            let remainingButtons = arrayActiveGridButtons();
            for (let i=0; i<remainingButtons.length; i++) {
                remainingButtons[i].removeEventListener("touchstart click", makePlayerSelection);
                remainingButtons[i].removeEventListener('click', makePlayerSelection);
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
    function selectOpponent(e) {
        Array.from(document.getElementsByClassName("selected")).forEach(function(element) {
            element.classList.remove("selected");
        });
        _toggleClass(e.target, "selected");
    }
    function _beginGame() {
        if (!document.querySelector(".selected")) {alert("Please choose an opponent first"); return}

        _toggleClass(newGameContainer,"divNotInUse");
        _toggleClass(gameContainer,"divNotInUse");
        _toggleClass(playAgainContainer, "divNotInUse");
        _toggleClass(document.querySelector("header"),"divNotInUse");
        //for now just going to pass text content. Don't know if this will need updating
        createGameGrid();
        opponentIsComputer = GameModule.newGame(document.querySelector(".selected").textContent, consecConnections); //have to update reset game if changes made here
    }
    function _resetGame() {
        clearGameGrid();
        createGameGrid();
        winnerContainer.classList.add("divNotInUse");
        isComputerTurn = false;
        GameModule.newGame(document.querySelector(".selected").textContent, consecConnections);
    }
    function addTouchAndClickList(divElement,elFunction) {
        divElement.addEventListener('click', elFunction); divElement.addEventListener('touchstart click', elFunction);
    }
    function arrayActiveGridButtons() {
        return document.getElementsByClassName("available");
    }
    function _updateSizes() {
        gridSize = gridSizeInput.value;
        document.getElementById("gridSizeDisplay").textContent = gridSize;
        consecConnections = connectionSizeInput.value;
        document.getElementById("connectionDisplay").textContent = consecConnections;
    }
    function _isDraw() {return numOfMoves === gridSize**2};


    function computerRandomMove() {
        let arrayObj ={};
        let arrayActive = arrayActiveGridButtons();
        if (arrayActive.length === 0) {return}
        arrayObj.target = arrayActive[Math.floor(Math.random() * (arrayActive.length))];
        arrayObj.isComputer = true;
        makePlayerSelection(arrayObj);
        isComputerTurn =false;
    }

    addTouchAndClickList(friendbtn, selectOpponent);
    addTouchAndClickList(computerbtn, selectOpponent);
    addTouchAndClickList(beginbtn, _beginGame);
    addTouchAndClickList(restartbtn, _resetGame);
    addTouchAndClickList(homebtn, function() {location.reload()});

    gridSizeInput.addEventListener("input",_updateSizes);
    connectionSizeInput.addEventListener("input", _updateSizes);

})();