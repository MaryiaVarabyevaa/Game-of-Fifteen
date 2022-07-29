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

// y - индекс элементов массива
// x - индекс элементов подмассива

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
    swap(blankCoords, btnCoords, matrix);
  }
});
