import { getRandomInt } from "./helpers";
import {
  getEmptyBoard,
  Board,
  Cell,
  getCell,
  setCell,
  getBoardDimensions,
  iterateBoardCells,
  Position,
  moveCell,
  getNeighboringCellPosition,
} from "./board";
import { isEmpty, EmptyCell } from "./empty";
import {
  getNewFish,
  isFish,
  Fish,
  isBreedTime,
  resetBreedTime,
  incAge,
} from "./fish";
import {
  getNewShark,
  isShark,
  Shark,
  eatFish,
  decEnergy,
  isSharkBreedTime,
  breadShark,
  isDead,
} from "./shark";

const isCellEmptyOrWithFish = (cell: Cell) => isEmpty(cell) || isFish(cell);

export const populateEmptyBoard = (
  board: Board,
  numberOfFish: number,
  numberOfSharks: number
): Board => {
  let cell: Cell;
  const [rows, cols] = getBoardDimensions(board);
  let row, col;
  let populatedBoard: Board = board;

  for (let i = 0; i < numberOfFish; i++) {
    do {
      row = getRandomInt(0, rows);
      col = getRandomInt(0, cols);
      cell = getCell([row, col], populatedBoard);
    } while (!isEmpty(cell));

    populatedBoard = setCell([row, col], getNewFish(), populatedBoard);
  }

  for (let i = 0; i < numberOfSharks; i++) {
    do {
      row = getRandomInt(0, rows);
      col = getRandomInt(0, cols);
      cell = getCell([row, col], populatedBoard);
    } while (!isEmpty(cell));

    populatedBoard = setCell([row, col], getNewShark(), populatedBoard);
  }

  return populatedBoard;
};

export const getStartingBoard = (
  rows: number,
  cols: number,
  numberOfFish: number,
  numberOfSharks: number
): Board => {
  const emptyBoard = getEmptyBoard(rows, cols);
  const startingBoard: Board = populateEmptyBoard(
    emptyBoard,
    numberOfFish,
    numberOfSharks
  );

  return startingBoard;
};

export const breed = (
  parentPosition: Position,
  board: Board,
  individual: Fish | Shark
) => {
  const childPosition = getNeighboringCellPosition(
    parentPosition,
    board,
    (cell: Cell) => isEmpty(cell)
  );

  if (!childPosition) {
    return board;
  }

  return setCell(childPosition, individual, board);
};

export const computeNextFishState = (
  fish: Fish,
  position: Position,
  board: Board
) => {
  const moveTo = getNeighboringCellPosition(position, board, isEmpty);

  if (!moveTo) {
    return board;
  }

  let nextBoard = moveCell(position, moveTo, board);

  incAge(fish);

  if (isBreedTime(fish, 90)) {
    resetBreedTime(fish);
    nextBoard = breed(moveTo, nextBoard, getNewFish());
  }

  return nextBoard;
};

const computeNextSharkState = (
  shark: Shark,
  position: Position,
  board: Board
) => {
  const moveTo = getNeighboringCellPosition(
    position,
    board,
    isCellEmptyOrWithFish
  );

  if (!moveTo) {
    return board;
  }

  let nextBoard = board;

  const cellToMove = getCell(moveTo, nextBoard);

  if (isFish(cellToMove)) {
    eatFish(shark, 30);
  } else {
    decEnergy(shark);
    if (isDead(shark)) {
      nextBoard = setCell(position, EmptyCell, nextBoard);
      return setCell(moveTo, EmptyCell, nextBoard);
    }
  }

  nextBoard = moveCell(position, moveTo, nextBoard);

  if (isSharkBreedTime(shark)) {
    breadShark(shark, 60);
    return breed(moveTo, nextBoard, getNewShark());
  }

  return nextBoard;
};

export const getNextBoard = (board: Board): Board => {
  let nextBoardState = board;

  iterateBoardCells(board, (cell, position) => {
    if (isFish(cell)) {
      nextBoardState = computeNextFishState(cell, position, nextBoardState);
    }

    if (isShark(cell)) {
      nextBoardState = computeNextSharkState(cell, position, nextBoardState);
    }
  });

  return nextBoardState;
};
