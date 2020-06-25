import {
  getEmptyBoard,
  // getCell,
  // setCell,
  moveCell,
  getNeighboringIndexes,
  getNeighboringCellIndex,
  getBoardDimensions,
  iterateBoardCells,
  getSimpleBoard,
} from "../board";

import { putNewFish, isFish, FISH_ID } from "../fish";
import { isEmpty, EMPTY_ID } from "../empty";
import { CellSize } from "../cell";
import { putNewShark, SHARK_ID } from "../shark";

describe("board", () => {
  test("getEmptyBoard", () => {
    const board = getEmptyBoard(4, 3);
    expect(board.dataView.byteLength).toEqual(12 * CellSize);
    let allEmpty = true;
    iterateBoardCells(board, cell => {
      if (!isEmpty(board, cell)) {
        allEmpty = false;
      }
    });
    expect(allEmpty).toBeTruthy;
  });

  test("getBoardDimensions", () => {
    const board = getEmptyBoard(4, 3);
    const [rows, cols] = getBoardDimensions(board);
    expect(rows).toEqual(4);
    expect(cols).toEqual(3);
  });

  describe("iterateBoardCells", () => {
    test("iterate through all cells", () => {
      const board = getEmptyBoard(3, 3);
      let cellsAmount = 0;
      iterateBoardCells(board, () => {
        cellsAmount++;
      });
      expect(cellsAmount).toEqual(9);
    });

    test("provides cell's position on board", () => {
      const board = getEmptyBoard(3, 3);
      putNewFish(board, 2, 0);
      let position = 0;

      iterateBoardCells(board, index => {
        if (isFish(board, index)) {
          position = index;
        }
      });
      expect(position).toEqual(2);
    });
  });

  // test("getCell", () => {
  //   const board = getEmptyBoard(3, 3);
  //   board[1][2] = fish;
  //   expect(getCell([0, 0], board)).toEqual([EMPTY_ID, 0]);
  //   expect(getCell([1, 2], board)).toEqual(fish);
  // });

  // test("setCell", () => {
  //   const board = getEmptyBoard(3, 3);
  //   setCell([1, 1], fish, board);
  //   expect(board[1][1]).toEqual(fish);
  // });

  test("moveCell", () => {
    const board = getEmptyBoard(3, 3);
    putNewFish(board, 2, 0);

    moveCell(board, 2, 4, 1);
    expect(isEmpty(board, 2)).toBeTruthy;
    expect(isFish(board, 4)).toBeTruthy;
  });

  describe("getNeighboringIndexes", () => {
    // 0  1  2  3
    // 4  5  6  7
    // 8  9  10 11
    test("when cell is in center", () => {
      const indexes = getNeighboringIndexes(5, 3, 4); // 5
      expect(indexes).toHaveLength(8);
      expect(indexes).toEqual(
        expect.arrayContaining([0, 1, 2, 4, 6, 8, 9, 10])
      );
    });

    test("when cell is on the top, it should be connected with bottom", () => {
      const indexes = getNeighboringIndexes(8, 3, 4); // 8
      expect(indexes).toHaveLength(8);
      expect(indexes).toEqual(expect.arrayContaining([4, 5, 9, 0, 11, 3, 7]));
    });
  });

  describe("getNeighboringCellIndex", () => {
    test("return empty cell", () => {
      const board = getEmptyBoard(3, 3);
      putNewFish(board, 0, 0);
      putNewFish(board, 1, 0);
      putNewFish(board, 2, 0);
      putNewFish(board, 3, 0);
      putNewFish(board, 4, 0);
      putNewFish(board, 6, 0);
      putNewFish(board, 7, 0);
      putNewFish(board, 8, 0);

      const cellIndex = getNeighboringCellIndex(board, 7, isEmpty);
      expect(cellIndex).toEqual(5);
    });

    test("return one cell when there are more valid cells", () => {
      const board = getEmptyBoard(3, 3);
      expect(getNeighboringCellIndex(board, 0, isEmpty)).not.toBeNull;
      expect(getNeighboringCellIndex(board, 1, isEmpty)).not.toBeNull;
      expect(getNeighboringCellIndex(board, 2, isEmpty)).not.toBeNull;
      expect(getNeighboringCellIndex(board, 3, isEmpty)).not.toBeNull;
      expect(getNeighboringCellIndex(board, 4, isEmpty)).not.toBeNull;
      expect(getNeighboringCellIndex(board, 5, isEmpty)).not.toBeNull;
      expect(getNeighboringCellIndex(board, 6, isEmpty)).not.toBeNull;
      expect(getNeighboringCellIndex(board, 7, isEmpty)).not.toBeNull;
      expect(getNeighboringCellIndex(board, 8, isEmpty)).not.toBeNull;
    });

    test("returns null when there is no empty cells", () => {
      const board = getEmptyBoard(3, 3);
      putNewFish(board, 0, 0);
      putNewFish(board, 1, 0);
      putNewFish(board, 2, 0);
      putNewFish(board, 3, 0);
      putNewFish(board, 4, 0);
      putNewFish(board, 6, 0);
      putNewFish(board, 7, 0);
      putNewFish(board, 8, 0);
      expect(getNeighboringCellIndex(board, 0, isEmpty)).toBeNull;
      expect(getNeighboringCellIndex(board, 1, isEmpty)).toBeNull;
      expect(getNeighboringCellIndex(board, 2, isEmpty)).toBeNull;
      expect(getNeighboringCellIndex(board, 3, isEmpty)).toBeNull;
      expect(getNeighboringCellIndex(board, 4, isEmpty)).toBeNull;
      expect(getNeighboringCellIndex(board, 5, isEmpty)).toBeNull;
      expect(getNeighboringCellIndex(board, 6, isEmpty)).toBeNull;
      expect(getNeighboringCellIndex(board, 7, isEmpty)).toBeNull;
      expect(getNeighboringCellIndex(board, 8, isEmpty)).toBeNull;
    });
  });

  describe("getSimpleBoard", () => {
    test("return correct simple board", () => {
      const board = getEmptyBoard(3, 3);
      putNewFish(board, 0, 0);
      putNewFish(board, 1, 0);
      putNewShark(board, 2, 0, 1);
      putNewFish(board, 3, 0);
      putNewShark(board, 6, 0, 1);
      putNewFish(board, 7, 0);

      const simpleBoard = getSimpleBoard(board);
      expect(simpleBoard).toEqual([
        [FISH_ID, FISH_ID, SHARK_ID],
        [FISH_ID, EMPTY_ID, EMPTY_ID],
        [SHARK_ID, FISH_ID, EMPTY_ID],
      ]);
    });
  });
});
