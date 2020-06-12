import { Fish } from "./fish";
import { Shark } from "./shark";
import { Empty } from "./empty";

export type Cell = Empty | Fish | Shark;

export const changeCellStateVersion = (
  cell: Cell,
  stateVersion: boolean
): void => {
  cell[2] = stateVersion;
};
