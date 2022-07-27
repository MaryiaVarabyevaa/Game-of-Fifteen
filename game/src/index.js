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
