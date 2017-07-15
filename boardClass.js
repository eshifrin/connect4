function createBoard() {
  return [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
  ];
}

class Game {
  instantiateGame() {
    this.board = createBoard();
    this.turn = '1';
    this.spotsLeft = 42;
    this.cols = {};
    this.end = false;
    return undefined;
  }

  togglePlayer() {
    this.turn = this.turn === '1' ? '2' : '1';
  }

  availableCol(col) {
    if (isNaN(col) || col < 0 || col > 6) {
      return false;
    }

    if (this.cols[col]) {
      return !this.cols[col].atMax;
    }

    return true;
  }

  drop(col) {
    if (!this.availableCol(col)) {
      return false;
    }

    this.cols[col] = this.cols[col] || { lastDrop: 6 };
    const nextRow = this.cols[col].lastDrop - 1;
    this.cols[col].lastDrop = nextRow;
    this.cols[col].atMax = !nextRow;
    this.toggleSpot(nextRow, col);
    this.spotsLeft -= 1;
    return nextRow;
  }

  checkForEndGame(r, c) {
    if (this.checkWinner(r, c) || !this.spotsLeft) {
      this.end = true;
    } else if (!this.spotsLeft) {
      this.end = true;
    }
  }

  toggleSpot(r, c) {
    this.board[r][c] = this.turn;
    return undefined;
  }

  checkWinner(r, c) {
    return this.checkCol(r, c) ||
      this.checkRow(r, c) ||
      this.checkMajorDiagonal(r, c) ||
      this.checkMinorDiagonal(r, c);
  }

  checkCol(r, c) {
    if (r > 2) {
      return false;
    }

    const { board, turn } = this;
    return board[r + 1][c] === turn &&
     board[r + 2][c] === turn && 
     board[r + 3][c] === turn;
  }

  checkRow(r, c) {
    const { board, turn } = this;
    const row = board[r];

    let matches = 1;
    let column = c - 1;
    while (column >= 0 && board[r][column] === turn) {
      matches += 1;
      column -= 1;
    }

    column = c + 1;
    while (column < 7 && board[r][column] === turn) {
      matches += 1;
      column += 1;
    }

    return matches === 4;
  }

  checkMajorDiagonal(r, c) {
    const { board, turn } = this;
    if (r > 2 || c < 3) {
      return false;
    }

    return board[r + 1][c - 1] === turn &&
      board[r + 2][c - 2] === turn &&
      board[r + 3][c - 3] === turn;
  }

  checkMinorDiagonal(r, c) {
    const { board, turn } = this;

    if (r > 2 || c > 4) {
      return false;
    }
    return board[r + 1][c + 1] === turn &&
      board[r + 2][c + 2] === turn &&
      board[r + 3][c + 3] === turn;
  }

  checkTie() {
    return !this.spotsLeft;
  }
}
