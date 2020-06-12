import { getRandomInt } from "./helpers";
import {
  getEmptyBoard,
  Board,
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
import { Cell } from "./cell";

export type EngineConfiguration = {
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
  stateVersion: boolean;

  constructor(
    boardSize: [number, number],
    startingFish: number,
    startingShark: number,
    conf: EngineConfiguration
  ) {
    this.conf = conf;
    this.stateVersion = true;
    this.board = getStartingBoard(
      boardSize[0],
      boardSize[1],
      startingFish,
      startingShark,
      this.stateVersion,
      conf
    );
  }

  nextState(): void {
    this.stateVersion = !this.stateVersion;

    iterateBoardCells(this.board, (cell, position) => {
      if (!isEmpty(cell) && !this.wasMoved(cell)) {
        if (isFish(cell)) {
          computeNextFishState(
            cell,
            position,
            this.board,
            this.conf,
            this.stateVersion
          );
        } else if (isShark(cell)) {
          computeNextSharkState(
            cell,
            position,
            this.board,
            this.conf,
            this.stateVersion
          );
        }
      }
    });
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

  private wasMoved(cell: Cell) {
    return cell[2] === this.stateVersion;
  }
}

const isCellEmptyOrWithFish = (cell: Cell) => isEmpty(cell) || isFish(cell);

export const breed = (
  parentPosition: Position,
  board: Board,
  individual: Fish | Shark
): void => {
  const childPosition = getNeighboringCellPosition(
    parentPosition,
    board,
    (cell: Cell) => isEmpty(cell)
  );

  if (!childPosition) {
    return;
  }

  setCell(childPosition, individual, board);
};

export const computeNextFishState = (
  fish: Fish,
  position: Position,
  board: Board,
  { fish: { breedTime } }: Pick<EngineConfiguration, "fish">,
  stateVersion: boolean
): void => {
  const moveTo = getNeighboringCellPosition(position, board, isEmpty);

  if (!moveTo) {
    return;
  }

  moveCell(position, moveTo, board, stateVersion);

  incAge(fish);

  if (isBreedTime(fish, breedTime)) {
    resetBreedTime(fish);
    breed(moveTo, board, getNewFish(stateVersion));
  }
};

const computeNextSharkState = (
  shark: Shark,
  position: Position,
  board: Board,
  {
    shark: { breedEnergy, energyBonus, startingEnergy },
  }: Pick<EngineConfiguration, "shark">,
  stateVersion: boolean
): void => {
  const moveTo = getNeighboringCellPosition(
    position,
    board,
    isCellEmptyOrWithFish
  );

  if (!moveTo) {
    return;
  }

  const cellToMove = getCell(moveTo, board);

  if (isFish(cellToMove)) {
    eatFish(shark, energyBonus);
  } else {
    decEnergy(shark);
    if (isDead(shark)) {
      setCell(position, EmptyCell, board);
      setCell(moveTo, EmptyCell, board);
      return;
    }
  }

  moveCell(position, moveTo, board, stateVersion);

  if (isSharkBreedTime(shark, breedEnergy)) {
    breadShark(shark, startingEnergy);
    breed(moveTo, board, getNewShark(startingEnergy, stateVersion));
    return;
  }
};

export const getStartingBoard = (
  rows: number,
  cols: number,
  numberOfFish: number,
  numberOfSharks: number,
  stateVersion: boolean,
  conf: EngineConfiguration
): Board => {
  const emptyBoard = getEmptyBoard(rows, cols);
  const startingBoard: Board = populateEmptyBoard(
    emptyBoard,
    numberOfFish,
    numberOfSharks,
    stateVersion,
    conf
  );

  return startingBoard;
};

const populateEmptyBoard = (
  board: Board,
  numberOfFish: number,
  numberOfSharks: number,
  stateVersion: boolean,
  conf: EngineConfiguration
): Board => {
  let cell: Cell;
  const [rows, cols] = getBoardDimensions(board);
  let row, col;
  const populatedBoard: Board = board;

  for (let i = 0; i < numberOfFish; i++) {
    do {
      row = getRandomInt(0, rows);
      col = getRandomInt(0, cols);
      cell = getCell([row, col], populatedBoard);
    } while (!isEmpty(cell));

    setCell([row, col], getNewFish(stateVersion), populatedBoard);
  }

  for (let i = 0; i < numberOfSharks; i++) {
    do {
      row = getRandomInt(0, rows);
      col = getRandomInt(0, cols);
      cell = getCell([row, col], populatedBoard);
    } while (!isEmpty(cell));

    setCell(
      [row, col],
      getNewShark(conf.shark.startingEnergy, stateVersion),
      populatedBoard
    );
  }

  return populatedBoard;
};
