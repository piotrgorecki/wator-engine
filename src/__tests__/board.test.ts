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

import { Fish, FISH_ID } from "../fish";
import { isEmpty, EMPTY_ID } from "../empty";

describe("board", () => {
  const fish: Fish = [FISH_ID, 0];

  test("getEmptyBoard", () => {
    const board = getEmptyBoard(4, 3);
    expect(board).toHaveLength(4);
    expect(board[0]).toHaveLength(3);
    expect(board.every(row => row.every(cell => cell[0] === FISH_ID)))
      .toBeTruthy;
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
      board[1][0] = fish;
      let row, col;

      iterateBoardCells(board, (cell, position) => {
        if (cell === fish) {
          [row, col] = position;
        }
      });
      expect(row).toEqual(1);
      expect(col).toEqual(0);
    });
  });

  test("getCell", () => {
    const board = getEmptyBoard(3, 3);
    board[1][2] = fish;
    expect(getCell([0, 0], board)).toEqual([EMPTY_ID, 0]);
    expect(getCell([1, 2], board)).toEqual(fish);
  });

  test("setCell", () => {
    const board = getEmptyBoard(3, 3);
    setCell([1, 1], fish, board);
    expect(board[1][1]).toEqual(fish);
  });

  test("moveCell", () => {
    const board = getEmptyBoard(3, 3);
    setCell([1, 1], fish, board);

    moveCell([1, 1], [1, 2], board);
    expect(board[1][1]).toEqual([EMPTY_ID, 0]);
    expect(board[1][2]).toEqual(fish);
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
      const board = getEmptyBoard(3, 3);
      board[0][0] = fish;
      board[0][1] = fish;
      board[0][2] = fish;
      board[1][0] = fish;
      board[1][1] = fish;
      board[1][2] = fish;
      board[2][0] = fish;
      board[2][2] = fish;

      const position = getNeighboringCellPosition([1, 2], board, isEmpty);
      expect(position).toEqual([2, 1]);
    });

    test("return one cell when there are more valid cells", () => {
      const board = getEmptyBoard(3, 3);
      const position = getNeighboringCellPosition([0, 1], board, isEmpty);
      expect(position).not.toBeNull;
    });

    test("returns null when there is no empty cells", () => {
      const board = getEmptyBoard(3, 3);
      board[0][0] = fish;
      board[0][1] = fish;
      board[0][2] = fish;
      board[1][0] = fish;
      board[1][1] = fish;
      board[1][2] = fish;
      board[2][0] = fish;
      board[2][1] = fish;
      board[2][2] = fish;
      const position = getNeighboringCellPosition([0, 1], board, isEmpty);
      expect(position).toBeNull;
    });
  });
});
