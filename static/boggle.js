"use strict";

const $playedWords = $("#words");
const $form = $("#newWordForm");
const $wordInput = $("#wordInput");
const $message = $(".msg");
const $table = $("table");

let gameId;


/** Start */

async function start() {
  let response = await axios.post("/api/new-game");
  gameId = response.data.gameId;
  let board = response.data.board;

  displayBoard(board);
}

/** Display board */

function displayBoard(board) {
  $table.empty();
  for (let row of board) {
    let $tr = $("<tr>");
    for (let letter of row) {
      $tr.append(`<td>${letter}</td>`);
    }
    $table.append($tr);
  }
}

/** Handle form submit: submit to API, focus on input. */

async function handleFormSubmit(evt) {
  evt.preventDefault();

  const word = $wordInput.val().toUpperCase();
  if (!word) return;

  await submitWordToAPI(word);

  $wordInput.val("").focus();
}

$form.on("submit", handleFormSubmit);


/** Submit word to API and handle response. */

async function submitWordToAPI(word) {
  const response = await axios({
    url: "/api/score-word",
    method: "POST",
    data: { word, gameId }
  });

  const { result } = response.data;

  if (result === "not-word") {
    showMessage(`Not valid word: ${word}`, "err");
  } else if (result === "not-on-board") {
    showMessage(`Not on board: ${word}`, "err");
  } else {
    showWord(word);
    showMessage(`Added: ${word}`, "ok");
  }
}


/** Add word to played word list in DOM */

function showWord(word) {
  $($playedWords).append($("<li>", { text: word }));
}


/** Show status message. */

function showMessage(msg, cssClass) {
  $message
    .text(msg)
    .removeClass()
    .addClass(`msg ${cssClass}`);
}


start();