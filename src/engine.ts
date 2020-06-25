import { getRandomInt } from "./helpers";
import {
  getEmptyBoard,
  Board,
  iterateBoardCells,
  moveCell,
  getNeighboringCellIndex,
  getBoardSize,
} from "./board";
import { isEmpty, putEmptyCell } from "./empty";
import {
  putNewFish,
  isFish,
  isBreedTime,
  resetBreedTime,
  incAge,
} from "./fish";
import {
  isShark,
  eatFish,
  decEnergy,
  isSharkBreedTime,
  resetEnergy,
  isDead,
  putNewShark,
} from "./shark";
import { CellOffset, CellIndex } from "./types";
import { getStateVersion } from "./cell";

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
  stateVersion: number;

  constructor(
    boardSize: [number, number],
    startingFish: number,
    startingShark: number,
    conf: EngineConfiguration
  ) {
    this.conf = conf;
    this.stateVersion = 0;
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
    this.stateVersion = this.stateVersion > 254 ? 0 : this.stateVersion + 1;

    iterateBoardCells(this.board, cellIndex => {
      if (!isEmpty(this.board, cellIndex) && !this.wasMoved(cellIndex)) {
        if (isFish(this.board, cellIndex)) {
          computeNextFishState(
            this.board,
            cellIndex,
            this.conf,
            this.stateVersion
          );
        } else if (isShark(this.board, cellIndex)) {
          computeNextSharkState(
            this.board,
            cellIndex,
            this.conf,
            this.stateVersion
          );
        }
      }
    });
  }

  getBoardStats() {
    const stats = { fish: 0, shark: 0 };

    iterateBoardCells(this.board, cellIndex => {
      if (isFish(this.board, cellIndex)) {
        stats.fish = stats.fish + 1;
      } else if (isShark(this.board, cellIndex)) {
        stats.shark = stats.shark + 1;
      }
    });

    return stats;
  }

  private wasMoved(cellIndex: CellIndex) {
    return getStateVersion(this.board, cellIndex) !== this.stateVersion;
  }
}

const isCellEmptyOrWithFish = (board: Board, cellOffset: CellOffset) =>
  isEmpty(board, cellOffset) || isFish(board, cellOffset);

export const computeNextFishState = (
  board: Board,
  index: CellIndex,
  { fish: { breedTime } }: Pick<EngineConfiguration, "fish">,
  stateVersion: number
): void => {
  const moveTo = getNeighboringCellIndex(board, index, isEmpty);

  if (!moveTo) {
    return;
  }

  moveCell(board, index, moveTo, stateVersion);
  incAge(board, moveTo);

  if (isBreedTime(board, moveTo, breedTime)) {
    resetBreedTime(board, moveTo);
    const childIndex = getNeighboringCellIndex(board, index, isEmpty);

    if (!childIndex) {
      return;
    }

    putNewFish(board, childIndex, stateVersion);
  }
};

const computeNextSharkState = (
  board: Board,
  index: CellIndex,
  {
    shark: { breedEnergy, energyBonus, startingEnergy },
  }: Pick<EngineConfiguration, "shark">,
  stateVersion: number
): void => {
  const moveTo = getNeighboringCellIndex(board, index, isCellEmptyOrWithFish);

  if (!moveTo) {
    return;
  }

  if (isFish(board, moveTo)) {
    eatFish(board, moveTo, energyBonus);
  } else {
    decEnergy(board, index);
    if (isDead(board, index)) {
      putEmptyCell(board, index);
      return;
    }
  }

  moveCell(board, index, moveTo, stateVersion);

  if (isSharkBreedTime(board, moveTo, breedEnergy)) {
    resetEnergy(board, moveTo, startingEnergy);

    const childIndex = getNeighboringCellIndex(board, index, isEmpty);

    if (!childIndex) {
      return;
    }

    putNewShark(board, childIndex, startingEnergy, stateVersion);
  }
};

export const getStartingBoard = (
  rows: number,
  cols: number,
  numberOfFish: number,
  numberOfSharks: number,
  stateVersion: number,
  conf: EngineConfiguration
): Board => {
  const startingBoard = getEmptyBoard(rows, cols);
  populateEmptyBoard(
    startingBoard,
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
  stateVersion: number,
  conf: EngineConfiguration
): void => {
  let cellOffset: CellOffset;

  for (let i = 0; i < numberOfFish; i++) {
    do {
      cellOffset = getRandomInt(0, getBoardSize(board));
    } while (!isEmpty(board, cellOffset));

    putNewFish(board, cellOffset, stateVersion);
  }

  for (let i = 0; i < numberOfSharks; i++) {
    do {
      cellOffset = getRandomInt(0, getBoardSize(board));
    } while (!isEmpty(board, cellOffset));

    putNewShark(board, cellOffset, conf.shark.startingEnergy, stateVersion);
  }
};
