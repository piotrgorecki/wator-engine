import { Board } from "./board";
import { CellIndex } from "./types";
import { getCellOffset, getId, setId, setStateVersion } from "./cell";

export type SharkId = 2;
export const SHARK_ID: SharkId = 2;

/**
 * Cell size is 4 bytes
 * 0 (8)  - type (ID)
 * 1 (16) - energy
 * 3 (8)  - state version
 */
export type Shark = SharkId;

const getEnergy = (board: Board, cellIndex: CellIndex) =>
  board.dataView.getUint8(getCellOffset(cellIndex) + 1);
const setEnergy = (board: Board, cellIndex: CellIndex, energy: number) => {
  board.dataView.setUint8(getCellOffset(cellIndex) + 1, energy);
};

export const isShark = (
  board: Board,
  toBeDetermined: CellIndex
): toBeDetermined is Shark => getId(board, toBeDetermined) === SHARK_ID;

export const putNewShark = (
  board: Board,
  cellIndex: CellIndex,
  startingEnergy: number,
  stateVersion: number
) => {
  setId(board, cellIndex, SHARK_ID);
  setEnergy(board, cellIndex, startingEnergy);
  setStateVersion(board, cellIndex, stateVersion);
};

export const decEnergy = (board: Board, cellIndex: CellIndex) => {
  setEnergy(board, cellIndex, getEnergy(board, cellIndex) - 1);
};

export const isSharkBreedTime = (
  board: Board,
  cellIndex: CellIndex,
  energyLevel: number
) => getEnergy(board, cellIndex) >= energyLevel;

export const incEnergy = (
  board: Board,
  cellIndex: CellIndex,
  energyBonus: number
) => {
  setEnergy(board, cellIndex, getEnergy(board, cellIndex) + energyBonus);
};

export const resetEnergy = (
  board: Board,
  cellIndex: CellIndex,
  startingEnergy: number
) => {
  setEnergy(board, cellIndex, startingEnergy);
};

export const isDead = (board: Board, cellIndex: CellIndex) =>
  getEnergy(board, cellIndex) <= 0;
