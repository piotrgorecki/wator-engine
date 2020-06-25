import { getRandomListItem } from "./helpers";
import { putEmptyCell } from "./empty";
import { copyCell, CellSize, getId } from "./cell";
import { CellOffset, CellIndex } from "./types";

export type Board = { rows: number; cols: number; dataView: DataView };
export type Position = [number, number]; // row, col

export const printBoard = (board: Board) => console.table(board);

export const getEmptyBoard = (rows: number, cols: number): Board => {
  if (rows < 3 || cols < 3) {
    throw new Error("minimal board's dimension is 3x3");
  }

  const buffer = new ArrayBuffer(rows * cols * CellSize);
  const board = { rows, cols, dataView: new DataView(buffer) };

  for (let cellIndex = 0; cellIndex < rows * cols; cellIndex++) {
    putEmptyCell(board, cellIndex);
  }

  return board;
};

/**
 * Return number of rows and cols
 */
export const getBoardDimensions = (board: Board): [number, number] => [
  board.rows,
  board.cols,
];

export const iterateBoardCells = (
  board: Board,
  fn: (cellIndex: CellIndex) => void
) => {
  const length = board.rows * board.cols;
  for (let cellIndex = 0; cellIndex < length; cellIndex++) {
    fn(cellIndex);
  }
};

/**
 * Returns two-dimension board of cell ids
 */
export const getSimpleBoard = (board: Board): Array<Array<number>> => {
  const simpleBoard = new Array(board.rows);
  let cellIndex = 0;

  for (let i = 0; i < board.rows; i++) {
    const cols = new Array(board.cols);
    for (let j = 0; j < board.cols; j++) {
      cols[j] = getId(board, cellIndex);
      cellIndex++;
    }
    simpleBoard[i] = cols;
  }

  return simpleBoard;
};

/**
 * Returns how many cell contains the board
 */
export const getBoardSize = (board: Board) =>
  board.dataView.byteLength / CellSize;

export const moveCell = (
  board: Board,
  from: CellOffset,
  to: CellOffset,
  stateVersion: number
): void => {
  copyCell(board, from, to, stateVersion);
  putEmptyCell(board, from);
};

export const getNeighboringIndexes = (
  cellOffset: CellOffset,
  rows: number,
  cols: number
): Array<CellOffset> => {
  const row = Math.floor(cellOffset / cols);
  const col = cellOffset - row * cols;

  const maxColIndex = cols - 1;
  const maxRowIndex = rows - 1;

  const left = col >= 1 ? col - 1 : maxColIndex;
  const right = col + 1 <= maxColIndex ? col + 1 : 0;
  const up = row >= 1 ? row - 1 : maxRowIndex;
  const down = row + 1 <= maxRowIndex ? row + 1 : 0;

  const positions: Array<[number, number]> = [
    [up, col],
    [down, col],
    [row, left],
    [row, right],
    [up, left],
    [up, right],
    [down, left],
    [down, right],
  ];

  return positions.map(([row, col]) => row * cols + col);
};

export const getNeighboringCellIndex = (
  board: Board,
  cellIndex: CellIndex,
  fn: (board: Board, cellIndex: CellIndex) => boolean
): null | CellIndex => {
  const { rows, cols } = board;
  const neighbors = getNeighboringIndexes(cellIndex, rows, cols);
  const selectedNeighbors: Array<CellOffset> = neighbors.filter(cellIndex =>
    fn(board, cellIndex)
  );

  if (!selectedNeighbors.length) {
    return null;
  }

  return getRandomListItem(selectedNeighbors);
};
