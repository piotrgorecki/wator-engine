import { getRandomListItem } from "./helpers";
import { EmptyCell } from "./empty";
import { Cell, changeCellStateVersion } from "./cell";

export type Board = Array<Array<Cell>>;
export type Position = [number, number]; // row, col

export const printBoard = (board: Board) => console.table(board);

export const getEmptyBoard = (rows: number, cols: number): Board => {
  if (rows < 3 || cols < 3) {
    throw new Error("minimal board's dimension is 3x3");
  }

  const board = new Array(rows);
  for (let r = 0; r < rows; r++) {
    board[r] = new Array(cols).fill(EmptyCell);
  }

  return board;
};

/**
 * Return number of rows and cols
 */
export const getBoardDimensions = (board: Board): [number, number] => [
  board.length,
  board[0].length,
];

export const iterateBoardCells = (
  board: Board,
  fn: (cell: Cell, position: Position) => void
) => {
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      fn(cell, [rowIndex, colIndex]);
    });
  });
};

export const getCell = ([row, col]: Position, board: Board): Cell => {
  return board[row]?.[col];
};

export const setCell = (
  [row, col]: Position,
  cell: Cell,
  board: Board
): void => {
  board[row][col] = cell;
};

export const moveCell = (
  from: Position,
  to: Position,
  board: Board,
  stateVersion: boolean
): void => {
  const cell = getCell(from, board);
  changeCellStateVersion(cell, stateVersion);
  setCell(from, EmptyCell, board);
  setCell(to, cell, board);
};

export const getNeighboringIndexes = (
  [row, col]: Position,
  rows: number,
  cols: number
): Array<Position> => {
  const maxColIndex = cols - 1;
  const maxRowIndex = rows - 1;

  const left = col >= 1 ? col - 1 : maxColIndex;
  const right = col + 1 <= maxColIndex ? col + 1 : 0;
  const up = row >= 1 ? row - 1 : maxRowIndex;
  const down = row + 1 <= maxRowIndex ? row + 1 : 0;

  const positions: Array<Position> = [
    [up, col],
    [down, col],
    [row, left],
    [row, right],
    [up, left],
    [up, right],
    [down, left],
    [down, right],
  ];

  return positions;
};

export const getNeighboringCellPosition = (
  position: Position,
  board: Board,
  fn: (cell: Cell) => boolean
): null | Position => {
  const [rows, cols] = getBoardDimensions(board);
  const neighbors = getNeighboringIndexes(position, rows, cols);

  const selectedNeighbors: Array<Position> = neighbors.filter(position =>
    fn(getCell(position, board))
  );

  if (!selectedNeighbors.length) {
    return null;
  }

  return getRandomListItem(selectedNeighbors);
};
