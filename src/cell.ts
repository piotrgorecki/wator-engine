import { Fish } from "./fish";
import { Shark } from "./shark";
import { Empty } from "./empty";
import { CellOffset, CellIndex } from "./types";
import { Board } from "./board";

export type Cell = Empty | Fish | Shark;

export const CellSize = 4;

export const getCellOffset = (cellIndex: CellIndex): CellOffset =>
  cellIndex * CellSize;

export const copyCell = (
  board: Board,
  from: CellIndex,
  to: CellIndex,
  stateVersion: number
) => {
  const dataView = board.dataView;

  dataView.setUint8(getCellOffset(to), dataView.getUint8(getCellOffset(from)));
  dataView.setUint16(
    getCellOffset(to) + 1,
    dataView.getUint16(getCellOffset(from) + 1)
  );
  dataView.setUint8(getCellOffset(to) + 3, stateVersion);
};

export const getId = (board: Board, cellIndex: CellIndex) =>
  board.dataView.getUint8(getCellOffset(cellIndex));
export const setId = (board: Board, cellIndex: CellIndex, id: number) => {
  board.dataView.setUint8(getCellOffset(cellIndex), id);
};

export const getStateVersion = (board: Board, cellIndex: CellIndex) =>
  board.dataView.getUint8(getCellOffset(cellIndex) + 3);
export const setStateVersion = (
  board: Board,
  cellIndex: CellIndex,
  stateVersion: number
) => {
  board.dataView.setUint8(getCellOffset(cellIndex) + 3, stateVersion);
};
