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
  console.log(response)
  gameId = response.data.gameId;
  let board = response.data.board;

  displayBoard(board);
}

/** Display board */

function displayBoard(board) {
   $table.empty();
  // loop over board and create the DOM tr/td structure
  for(let row of board){
    let $row =$("<tr></tr>");
    for(let cell of row){
      $row.append($(`<td>${cell}</td>`));
    }
    $table.append($row)
  }
}

async function scoreWord(event){
  event.preventDefault();
  let response = await axios.post("/api/score-word",{
    word: $wordInput.val(),
    gameId: gameId
  });
  if(response === "not-word" || "not-on-board"){
    $message.empty();
    $message.append($("Not legal play"));
  } else {
    $playedwords.append($wordInput.val());
  }


}


$form.on("submit",scoreWord)
start();