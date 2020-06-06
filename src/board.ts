import { Fish } from "./fish";
import { Shark } from "./shark";
import { EmptyCell, Empty } from "./empty";
import { getRandomListItem } from "./helpers";

export type Cell = Empty | Fish | Shark;
export type Board = ReadonlyArray<ReadonlyArray<Cell>>;
export type Position = [number, number]; // row, col

const arePositionsEqual = ([a, b]: Position, [x, y]: Position) =>
  a === x && b === y;

export const printBoard = (board: Board) => console.table(board);

export const getEmptyBoard = (rows: number, cols: number): Board => {
  let board: Board = [];
  for (let r = 0; r < rows; r++) {
    board = [...board, new Array(cols).fill(EmptyCell)];
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

export const getCell = ([row, col]: Position, board: Board): Cell =>
  board[row]?.[col];

export const setCell = (
  [row, col]: Position,
  cell: Cell,
  board: Board
): Board =>
  Object.assign([], board, {
    [row]: Object.assign([], board[row], { [col]: cell }),
  });

export const moveCell = (from: Position, to: Position, board: Board): Board => {
  const cell = getCell(from, board);
  const tmpBoard = setCell(from, EmptyCell, board);
  return setCell(to, cell, tmpBoard);
};

export const getNeighboringIndexes = (
  [row, col]: Position,
  rows: number,
  cols: number
): Array<Position> => {
  const maxColIndex = cols - 1;
  const maxRowIndex = rows - 1;

  const left = row - 1 >= 0 ? row - 1 : maxRowIndex;
  const right = row + 1 <= maxRowIndex ? row + 1 : 0;
  const up = col - 1 >= 0 ? col - 1 : maxColIndex;
  const down = col + 1 <= maxColIndex ? col + 1 : 0;

  const positions: Array<Position> = [
    [row, up],
    [row, down],
    [left, col],
    [right, col],
    [left, up],
    [left, down],
    [right, up],
    [right, down],
  ];

  return positions.reduce(
    (positions: Array<Position>, rowCol: Position) =>
      // in small board like 2x2 or 1x3 it is possible to point the same cells
      positions.some(position => arePositionsEqual(position, rowCol))
        ? positions
        : [...positions, rowCol],
    []
  );
};

export const getNeighboringCellPosition = (
  position: Position,
  board: Board,
  fn: (cell: Cell) => boolean
): null | Position => {
  const neighbors = getNeighboringIndexes(
    position,
    board.length,
    board[0].length
  );

  const emptyNeighbors: Array<Position> = neighbors.filter(position =>
    fn(getCell(position, board))
  );

  if (!emptyNeighbors.length) {
    return null;
  }

  return getRandomListItem(emptyNeighbors);
};
