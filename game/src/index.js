/* eslint-disable no-useless-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import "./sass/style.scss";

const values = new Array(16).fill(0).map((item, index) => index + 1);
const wrapperGame = document.querySelector(".wrapper-game");

function createBtns() {
  for (let i = 0; i < values.length; i++) {
    let btn = document.createElement("button");
    let span = document.createElement("span");
    btn.classList.add("item");
    btn.setAttribute("data-id", values[i]);
    span.classList.add("item__value");
    span.innerHTML = values[i];
    btn.append(span);
    wrapperGame.append(btn);
  }
}
createBtns();

const items = Array.from(document.querySelectorAll(".item"));
const countItems = 16;

if (items.length !== 16) {
  throw new Error(`Должно быть ровно ${countItems} items в HTML`);
}

function getMatrix(arr) {
  const size = 4;
  let subArray = [];
  for (let i = 0; i < Math.ceil(arr.length / size); i++) {
    subArray[i] = arr.slice((i * size), (i * size) + size);
  }
  return subArray;
}

items[countItems - 1].style.display = "none";
let matrix = getMatrix(
  items.map((item) => Number(item.dataset.id))
);

function setNodeStyles(node, x, y) {
  const shiftPs = 100;
  // eslint-disable-next-line no-param-reassign
  node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`;
}

function setPositionItems(arr) {
  for (let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[y].length; x++) {
      const value = arr[y][x];
      const node = items[value - 1];
      setNodeStyles(node, x, y);
    }
  }
}
setPositionItems(matrix);

const watch = document.querySelector(".watch");
let milliSecs = 0;
let timer;

function startWatch() {
  clearInterval(timer);
  timer = setInterval(() => {
    milliSecs += 10;
    let dateTimer = new Date(milliSecs);
    watch.innerHTML = ("0" + dateTimer.getUTCHours()).slice(-2) + ":" + 
                      ("0" + dateTimer.getUTCMinutes()).slice(-2) + ":" +
                      ("0" + dateTimer.getUTCSeconds()).slice(-2) + ":" +
                      ("0" + dateTimer.getUTCMilliseconds()).slice(-3, -1);
  }, 10);
}

function pausedWatch() {
  clearInterval(timer);
}

function resetWatch() {
  clearInterval(timer);
  milliSecs = 0;
  watch.innerHTML = "00:00:00";
}

/* shuffle part */

function shuffleArr(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

let shuffleBtn = document.querySelector(".btn");
shuffleBtn.addEventListener("click", () => {
  const flatArr = matrix.flat();
  const shuffledArr = shuffleArr(flatArr);
  matrix = getMatrix(shuffledArr);
  setPositionItems(matrix);
  resetWatch();
  movePart.innerHTML = 0;
});

/* change position by click part */

function findCoordsByNum(number, arr) {
  for (let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[y].length; x++) {
      if (matrix[y][x] === number) {
        return { x, y };
      }
    }
  }
  return null;
}

function isValidForSwap(coords1, coords2) {
  const diffX = Math.abs(coords1.x - coords2.x);
  const diffY = Math.abs(coords1.y - coords2.y);

  return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y);
}

function swap(coords1, coords2, arr) {
  const coords1Num = arr[coords1.y][coords1.x];
  arr[coords1.y][coords1.x] = arr[coords2.y][coords2.x];
  arr[coords2.y][coords2.x] = coords1Num;
  setPositionItems(matrix);
  if (isWon(matrix)) {
    addWonFunc();
    pausedWatch();
  }
}

const movePart = document.querySelector(".move-container h3 span");

function moveTime() {
  const moveTimes = ++movePart.innerHTML;
}

wrapperGame.addEventListener("click", (event) =>{
  const btn = event.target.closest("button");
  if (!btn) {
    return;
  }
  const btnNum = Number(btn.dataset.id);
  const btnCoords = findCoordsByNum(btnNum, matrix);
  const blankCoords = findCoordsByNum(countItems, matrix);
  const isValid = isValidForSwap(btnCoords, blankCoords);
  if (isValid) {
    moveTime();
    startWatch();
    swap(blankCoords, btnCoords, matrix);
    setPositionItems(matrix);
  }
});

/* change position by arrows */

window.addEventListener("keydown", (event) => {
  if (!event.key.includes("Arrow")) {
    // eslint-disable-next-line no-useless-return
    return;
  }
  const blankCoords = findCoordsByNum(countItems, matrix);
  const maxIndexMatrix = matrix.length;
  const btnCoords = {
    x: blankCoords.x,
    y: blankCoords.y
  };
  startWatch();
  moveTime();
  const direction = event.key.split("Arrow")[1].toLowerCase();
  switch (direction) {
    case "up":
      btnCoords.y += 1;
      break;
    case "down":
      btnCoords.y -= 1;
      break;
    case "right":
      btnCoords.x -= 1;
      break;
    case "left":
      btnCoords.x += 1;
      break;
    default:
      break;
  }
  // eslint-disable-next-line max-len
  if (btnCoords.y >= maxIndexMatrix || btnCoords.y < 0 || btnCoords.x >= maxIndexMatrix || btnCoords.x < 0) {
    return;
  }

  swap(blankCoords, btnCoords, matrix);
  setPositionItems(matrix);
});

/* part for winners */

const winFlatArr = new Array(16).fill(0).map((item, i) => i + 1);
function isWon(matrix) {
  const flatMatrix = matrix.flat();
  for (let i = 0; i < winFlatArr.length; i++) {
    if (flatMatrix[i] !== winFlatArr[i]) {
      return false;
    }
  }
  return true;
}

const popup = document.querySelector("#popup");
const shadowItem = document.querySelector(".shadow");

function addActiveClass() {
  shadowItem.classList.add("active");
  popup.classList.add("active");
  pausedWatch();
}

function removeActiveClass() {
  shadowItem.classList.remove("active");
  popup.classList.remove("active");
  movePart.innerHTML = 0;
  resetWatch();
}

function addWonFunc() {
  setTimeout(()=> {
    addActiveClass();
    setTimeout(()=> {
      removeActiveClass();
    }, 1000);
  }, 200);
}
