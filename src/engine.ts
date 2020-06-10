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

type EngineConfiguration = {
  fish: {
    breedTime: number;
  };
  shark: {
    startingEnergy: number;
    breedEnergy: number;
    energyBonus: number;
  };
};

export default class Engine {
  board: Board;
  conf: EngineConfiguration;

  constructor(
    boardSize: [number, number],
    startingFish: number,
    startingShark: number,
    conf: EngineConfiguration
  ) {
    this.conf = conf;
    this.board = getStartingBoard(
      boardSize[0],
      boardSize[1],
      startingFish,
      startingShark
    );
  }

  nextState(): void {
    let nextBoardState = this.board;

    iterateBoardCells(this.board, (cell, position) => {
      if (isFish(cell)) {
        nextBoardState = computeNextFishState(
          cell,
          position,
          nextBoardState,
          this.conf
        );
      }

      if (isShark(cell)) {
        nextBoardState = computeNextSharkState(
          cell,
          position,
          nextBoardState,
          this.conf
        );
      }
    });

    this.board = nextBoardState;
  }

  getBoardStats() {
    let stats = { fish: 0, shark: 0 };

    iterateBoardCells(this.board, (cell: Cell) => {
      if (isFish(cell)) {
        stats = { ...stats, fish: stats.fish + 1 };
      } else if (isShark(cell)) {
        stats = { ...stats, shark: stats.shark + 1 };
      }
    });

    return stats;
  }
}

const isCellEmptyOrWithFish = (cell: Cell) => isEmpty(cell) || isFish(cell);

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
  board: Board,
  { fish: { breedTime } }: Pick<EngineConfiguration, "fish">
) => {
  const moveTo = getNeighboringCellPosition(position, board, isEmpty);

  if (!moveTo) {
    return board;
  }

  let nextBoard = moveCell(position, moveTo, board);

  incAge(fish);

  if (isBreedTime(fish, breedTime)) {
    resetBreedTime(fish);
    nextBoard = breed(moveTo, nextBoard, getNewFish());
  }

  return nextBoard;
};

const computeNextSharkState = (
  shark: Shark,
  position: Position,
  board: Board,
  {
    shark: { breedEnergy, energyBonus, startingEnergy },
  }: Pick<EngineConfiguration, "shark">
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
    eatFish(shark, energyBonus);
  } else {
    decEnergy(shark);
    if (isDead(shark)) {
      nextBoard = setCell(position, EmptyCell, nextBoard);
      return setCell(moveTo, EmptyCell, nextBoard);
    }
  }

  nextBoard = moveCell(position, moveTo, nextBoard);

  if (isSharkBreedTime(shark, breedEnergy)) {
    breadShark(shark, startingEnergy);
    return breed(moveTo, nextBoard, getNewShark(startingEnergy));
  }

  return nextBoard;
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

const populateEmptyBoard = (
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
