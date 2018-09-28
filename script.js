let boardLength = document.querySelector(".boardLength");
let manyBomb = document.querySelector(".manyBomb");
let submitManyBomb = document.querySelector(".submitManyBomb");
let messageShow = document.querySelector(".messageShow");
let showBoardPlay = document.querySelector('.showBoardPlay');
showBoardPlay.style.whiteSpace = 'pre';
let boxNumber = document.querySelector(".boxNumber");
let boardCheat = document.querySelector(".boardCheat");
boardCheat.style.whiteSpace = 'pre';
let submitNumber = document.querySelector(".submitNumber");
submitNumber.disabled = true;
let submitReset = document.querySelector(".submitReset");
submitReset.disabled = true;
const minBoard = 1;
let boxToOpen;
let board = []
const neighbor = [
  -1, 1
]

function initBoard() {
  boardLengthAdmin = 0;
  board = [];
  submitManyBomb.disabled = false;
  submitNumber.disabled = true;
  submitReset.disabled = true;
  boardCheat.textContent = '';
  showBoardPlay.textContent = '';
  boardLength.value = '';
  manyBomb.value = '';
  boardLength.focus();
  messageShow.textContent = '';
}

function initBombAdmin() {
  if (createBoard(Number(boardLength.value), minBoard, board) === false) {
    boardLength.value = '';
    boardLength.focus();
    manyBomb.value = '';
    board = [];
    return false
  };
  const numberOfBomb = Number(manyBomb.value);
  if (numberOfBomb < 1) {
    // alert('Langsung menang yey');
    messageShow.textContent = `Langsung menang yey`
    gameOver();
    return false;
  }
  if (createBomb(numberOfBomb, board, neighbor) === false) {
    manyBomb.value = '';
    manyBomb.focus()
  } else {
    messageShow.textContent = '';
    submitManyBomb.disabled = true;
  }
}

function createBoard(length, minBoard, board) {
  if (length < minBoard) {
    // alert('Panjang kotak minimal 1')
    messageShow.textContent = `Panjang kotak minimal 1`
    return false
  }
  for (let i = 0; i < length; i++) {
    let tempTile = {tile: 0, show: '?', isOpen: false};
    board.push(tempTile);
  }
  return true
}

function createBomb(numberOfBomb, board, neighbor) {
  const maxBomb = Math.ceil(board.length / 3);
  if (numberOfBomb > maxBomb) {
    // alert(`Bomb maksimal ${maxBomb}`);
    messageShow.textContent = `Bomb maksimal ${maxBomb}`
    return false;
  }
  let bombTotal = numberOfBomb;
  while (bombTotal > 0) {
    let indexOfBomb = Math.floor(Math.random() * board.length)
    if (board[indexOfBomb].tile === 0) {
      board[indexOfBomb].tile = '*'
      bombTotal -= 1;
      neighbor.map(index => {
        if (board[indexOfBomb + index] !== undefined && board[indexOfBomb + index].tile !== '*') {
          board[indexOfBomb + index].tile += 1;
        }
      })
    }
  }
  boxToOpen = board.length - numberOfBomb;
  printBoard(board);
  submitNumber.disabled = false;
  return true
}

function clickSubmitNumber() {
  const indexChoosen = Number(boxNumber.value) - 1;
  if (indexChoosen < 0 || indexChoosen > board.length - 1) {
    messageShow.textContent = `Di luar pilihan papan`
  }
  chooseNumber(indexChoosen, neighbor, board);
  boxNumber.value = '';
  boxNumber.focus();
}

function chooseNumber(indexChoosen, neighbor, board, isLoopNeighbor = false) {
  let endGame = false;
  if (indexChoosen < 0 || indexChoosen > board.length - 1) {
    // alert('Di luar pilihan papan')
    return false;
  }
  if (board[indexChoosen].isOpen === true) {
    return false;
  }
  if (board[indexChoosen].tile === '*') {
    // ga pede nih
    if (isLoopNeighbor === false) {
      board[indexChoosen].show = board[indexChoosen].tile
      // alert('Game Over');
      messageShow.textContent = `Game Over`
      endGame = true;
      gameOver();
    }
  } else if (board[indexChoosen].tile !== 0) {
    board[indexChoosen].show = board[indexChoosen].tile;
    board[indexChoosen].isOpen = true;
    boxToOpen -= 1;
    if (isLoopNeighbor === true) {
      return false
    }
  } else {
    board[indexChoosen].show = board[indexChoosen].tile;
    board[indexChoosen].isOpen = true;
    boxToOpen -= 1;
    neighbor.map(index => {
      chooseNumber(indexChoosen + index, neighbor, board, true);
    })
  }
  printBoard(board)
  if (boxToOpen === 0 && isLoopNeighbor === false && endGame === false) {
    messageShow.textContent = `Kamu menang`
    gameOver();
  }
  return false;
}

function gameOver() {
  submitNumber.disabled = true;
  submitReset.disabled = false;
}

function printBoard(board) {
  let tempForShowBoard = '';
  let tempForCheatBoard = '';
  for (let i = 0; i < board.length; i++) {
    tempForCheatBoard += `${i+1}`.padEnd(4, ' ');
    tempForShowBoard += `${i+1}`.padEnd(4, ' ');
  }
  tempForCheatBoard += '\n';
  tempForShowBoard += '\n';
  board.map(el => {
    tempForCheatBoard += String(el.tile).padEnd(4, ' ');
    tempForShowBoard += String(el.show).padEnd(4, ' ');
  });
  showBoardPlay.textContent = tempForShowBoard
  boardCheat.textContent = tempForCheatBoard
  return false;
}

submitManyBomb.addEventListener('click', initBombAdmin);
submitNumber.addEventListener('click', clickSubmitNumber);
submitReset.addEventListener('click', initBoard);