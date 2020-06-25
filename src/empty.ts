import { Board } from "./board";
import { CellIndex } from "./types";
import { getId, setId } from "./cell";

type EmptyId = 0;
export const EMPTY_ID: EmptyId = 0;

/**
 * Cell size is 4 bytes
 * 0 (8)  - type (ID)
 * 1 (16) - not used
 * 3 (8)  - not used
 */
export type Empty = EmptyId;

export const isEmpty = (
  board: Board,
  toBeDetermined: CellIndex
): toBeDetermined is Empty => getId(board, toBeDetermined) === EMPTY_ID;

export const putEmptyCell = (board: Board, cellIndex: CellIndex) => {
  setId(board, cellIndex, EMPTY_ID);
};
