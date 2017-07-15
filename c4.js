
function appendTopRow(game) {
  const boardElement = $('.board');
  const dropRow = $('<div></div>');
  dropRow.addClass('row dropRow');

  for (let i = 0; i < 7; i += 1) {
    const nd = $('<div></div>');
    nd.addClass(`drop col-${i} player-1`);
    nd.hover(function () {
      $(this).prop('innerHTML', '&#9673');
    }, function () {
      $(this).prop('innerHTML', '');
    });

    nd.click(function (e) {
      onMove(e, game);
    });

    dropRow.append(nd);
    dropRow.click(function(e) {
      $('.drop').toggleClass('player-1');
      $('.drop').toggleClass('player-2');
    });
  }

  boardElement.append(dropRow);
  return undefined;
}

function displayNextMessage(player, tieOrWinner = '') {
  let message;

  if (tieOrWinner === 'tie') {
    message = 'we have a tie';
  } else if (tieOrWinner === 'winner') {
    message = `player ${player} wins`;
  } else {
    message = `player ${player} turn`;
  }

  $('.message').prop('innerText', message);
}

function endGameOrNextMove(game, row, col) {
  if (game.checkTie()) {
    displayNextMessage(game.turn, 'tie');
    $('.board').addClass('board-end');
    game.end = true;     
  } else if (game.checkWinner(row, col)) {
    displayNextMessage(game.turn, 'winner');
    $('.board').addClass('board-end');
    game.end = true;
  } else {
    game.togglePlayer();
    displayNextMessage(game.turn);
  }

  return undefined;
}

function onMove(el, game) {
  if (game.end) {
    return;
  }

  const colClass = el.currentTarget.classList[1];
  const player = game.turn;
  const col = Number(colClass.split('-')[1]);
  const row = game.drop(col);

  if (row === false) {
    return undefined;
  }

  const box = $(`.col-${col}.row-${row}`);
  box.prop('innerHTML', '&#9673');
  box.addClass(`played player-${player}`);
  endGameOrNextMove(game, row, col);
}

function renderBoard(game) {
  const boardElement = $('.board');
  game.board.forEach((row, rowIdx) => {
    const nextRow = $(`<div class="row board-row row-${rowIdx}"></div>`)
    row.forEach((box, colIdx) => {
      const nextBox = $('<div></div>');
      nextBox.addClass(`box row-${rowIdx} col-${colIdx}`);
      nextRow.append(nextBox);
    });
    boardElement.append(nextRow);
  });

  return undefined;
};

function startNewGame() {
  const game = new Game();
  game.instantiateGame();
  appendTopRow(game);
  renderBoard(game);
  renderButton();
  displayNextMessage(game.turn);
};

function renderButton() {
  let newButton = $('<div class="new-game">NEW GAME</div>');
  newButton.click(function () {
    $('.board').empty();
    $(this).remove();
    startNewGame();
  });

  $('.container').append(newButton);
  return undefined;
}

$(() => {
  startNewGame();
});
