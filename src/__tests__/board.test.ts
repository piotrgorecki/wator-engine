import {
  getEmptyBoard,
  getCell,
  setCell,
  moveCell,
  getNeighboringIndexes,
  getNeighboringCellPosition,
  getBoardDimensions,
  iterateBoardCells,
} from "../board";

import { Fish } from "../fish";
import { isEmpty } from "../empty";

describe("board", () => {
  const fish: Fish = { age: 0, _type: "fish" };

  test("getEmptyBoard", () => {
    const board = getEmptyBoard(2, 3);
    expect(board).toHaveLength(2);
    expect(board[0]).toHaveLength(3);
    expect(board.every(row => row.every(cell => cell._type === "empty")))
      .toBeTruthy;
  });

  test("getBoardDimensions", () => {
    const board = getEmptyBoard(2, 3);
    const [rows, cols] = getBoardDimensions(board);
    expect(rows).toEqual(2);
    expect(cols).toEqual(3);
  });

  describe("iterateBoardCells", () => {
    test("iterate through all cells", () => {
      const board = getEmptyBoard(2, 3);
      let cellsAmount = 0;
      iterateBoardCells(board, () => {
        cellsAmount++;
      });
      expect(cellsAmount).toEqual(6);
    });

    test("provides cell's position on board", () => {
      const board = getEmptyBoard(2, 3);
      // @ts-ignore
      board[1][0] = "test";
      let row, col;

      iterateBoardCells(board, (cell, position) => {
        // @ts-ignore
        if (cell === "test") {
          [row, col] = position;
        }
      });
      expect(row).toEqual(1);
      expect(col).toEqual(0);
    });
  });

  test("getCell", () => {
    const board = getEmptyBoard(2, 3);
    // @ts-ignore
    board[1][2] = 2;
    expect(getCell([0, 0], board)).toEqual({ _type: "empty" });
    expect(getCell([1, 2], board)).toEqual(2);
  });

  test("setCell", () => {
    const board = getEmptyBoard(2, 3);
    //@ts-ignore
    const nextBoard = setCell([1, 1], { _type: "test" }, board);
    expect(nextBoard[1][1]).toEqual({ _type: "test" });
  });

  test("moveCell", () => {
    const board = getEmptyBoard(2, 3);
    const boardWithFish = setCell([1, 1], fish, board);

    const nextBoard = moveCell([1, 1], [1, 2], boardWithFish);
    expect(nextBoard[1][1]).toEqual({ _type: "empty" });
    expect(nextBoard[1][2]).toEqual(fish);
  });

  describe("getNeighboringIndexes", () => {
    // 0  1  2  3
    // 4  5  6  7
    // 8  9  10 11
    test("when cell is in center", () => {
      const indexes = getNeighboringIndexes([1, 1], 3, 4); // 5
      expect(indexes).toHaveLength(8);
      expect(indexes).toEqual(
        expect.arrayContaining([
          [1, 0],
          [1, 2],
          [0, 1],
          [2, 1],
          [0, 0],
          [2, 0],
          [0, 2],
          [2, 2],
        ])
      );
    });

    test("when cell is on the top, it should be connected with bottom", () => {
      const indexes = getNeighboringIndexes([2, 0], 3, 4); // 8
      expect(indexes).toHaveLength(8);
      expect(indexes).toEqual(
        expect.arrayContaining([
          [2, 3],
          [2, 1],
          [1, 0],
          [0, 0],
          [1, 3],
          [0, 3],
          [1, 1],
          [0, 1],
        ])
      );
    });
  });

  describe("getNeighboringCellPosition", () => {
    test("return empty cell", () => {
      const board = getEmptyBoard(2, 2);
      // @ts-ignore
      board[0][0] = 2;
      // @ts-ignore
      board[0][1] = 2;
      // @ts-ignore
      board[1][0] = 2;

      const position = getNeighboringCellPosition([0, 0], board, isEmpty);
      expect(position).toEqual([1, 1]);
    });

    test("return one cell when there are more valid cells", () => {
      const board = getEmptyBoard(2, 2);
      const position = getNeighboringCellPosition([0, 1], board, isEmpty);
      expect(position).not.toBeNull;
    });

    test("returns null when there is no empty cells", () => {
      const board = getEmptyBoard(2, 2);
      // @ts-ignore
      board[0][0] = 2;
      // @ts-ignore
      board[0][1] = 2;
      // @ts-ignore
      board[1][0] = 2;
      // @ts-ignore
      board[1][1] = 2;
      const position = getNeighboringCellPosition([0, 1], board, isEmpty);
      expect(position).toBeNull;
    });
  });
});
