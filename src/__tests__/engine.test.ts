import {
  getStartingBoard,
  computeNextFishState,
  EngineConfiguration,
} from "../engine";
import { isFish } from "../fish";
import { isShark } from "../shark";
import { iterateBoardCells } from "../board";

const conf: EngineConfiguration = {
  fish: {
    breedTime: 10,
  },
  shark: {
    breedEnergy: 10,
    energyBonus: 10,
    startingEnergy: 10,
  },
};

describe("engine", () => {
  test("getStartingBoard", () => {
    const startingBoard = getStartingBoard(3, 4, 4, 3, true, conf);

    let fishAmount = 0;
    let sharkAmount = 0;

    iterateBoardCells(startingBoard, cell => {
      if (isFish(cell)) {
        fishAmount++;
      }

      if (isShark(cell)) {
        sharkAmount++;
      }
    });

    expect(fishAmount).toEqual(4);
    expect(sharkAmount).toEqual(3);
  });

  describe("computeNextFishState", () => {
    test("moving", () => {
      const board = getStartingBoard(3, 4, 1, 1, true, conf);
      let fish, position;

      iterateBoardCells(board, (cell, pos) => {
        if (isFish(cell)) {
          fish = cell;
          position = pos;
        }
      });

      expect(fish).not.toBeNull;
      expect(position).not.toBeNull;

      if (!position) return;
      expect(position[0]).not.toBeNaN;
      expect(position[1]).not.toBeNaN;

      if (!fish) return;

      computeNextFishState(
        fish,
        position,
        board,
        { fish: { breedTime: 10 } },
        true
      );

      let nextFish, nextPosition;
      iterateBoardCells(board, (cell, pos) => {
        if (isFish(cell)) {
          nextFish = cell;
          nextPosition = pos;
        }
      });

      expect(nextFish).toEqual(fish);
      expect(nextPosition).not.toBeNull;

      expect(nextPosition).not.toEqual(position);
    });
  });
});
