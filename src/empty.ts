import { Cell } from "./cell";

type EmptyId = 0;
export const EMPTY_ID: EmptyId = 0;

// [ID, not used, not used]
export type Empty = [EmptyId, 0, true];

export const EmptyCell: Empty = [EMPTY_ID, 0, true];

export const isEmpty = (toBeDetermined: Cell): toBeDetermined is Empty =>
  toBeDetermined[0] === EMPTY_ID;
