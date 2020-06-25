import { Board } from "./board";
import { CellIndex } from "./types";
import { getCellOffset, getId, setId, setStateVersion } from "./cell";

export type FishId = 1;
export const FISH_ID: FishId = 1;

/**
 * Cell size is 4 bytes
 * 0 (8)  - type (ID)
 * 1 (16) - age
 * 3 (8)  - state version
 */
export type Fish = FishId;

const getAge = (board: Board, cellIndex: CellIndex) =>
  board.dataView.getUint8(getCellOffset(cellIndex) + 1);
const setAge = (board: Board, cellIndex: CellIndex, age: number) => {
  board.dataView.setUint8(getCellOffset(cellIndex) + 1, age);
};

export const isFish = (
  board: Board,
  toBeDetermined: CellIndex
): toBeDetermined is Fish => getId(board, toBeDetermined) === FISH_ID;

export const putNewFish = (
  board: Board,
  cellIndex: CellIndex,
  stateVersion: number
) => {
  setId(board, cellIndex, FISH_ID);
  setAge(board, cellIndex, 0);
  setStateVersion(board, cellIndex, stateVersion);
};

export const isBreedTime = (
  board: Board,
  cellIndex: CellIndex,
  bredTime: number
) => getAge(board, cellIndex) >= bredTime;

export const resetBreedTime = (board: Board, cellIndex: CellIndex) => {
  setAge(board, cellIndex, 0);
};

export const incAge = (board: Board, cellIndex: CellIndex) => {
  setAge(board, cellIndex, getAge(board, cellIndex) + 1);
};
