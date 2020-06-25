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
    const startingBoard = getStartingBoard(3, 4, 4, 3, 0, conf);
    let fishAmount = 0;
    let sharkAmount = 0;

    iterateBoardCells(startingBoard, index => {
      if (isFish(startingBoard, index)) {
        fishAmount++;
      }

      if (isShark(startingBoard, index)) {
        sharkAmount++;
      }
    });

    expect(fishAmount).toEqual(4);
    expect(sharkAmount).toEqual(3);
  });

  describe("computeNextFishState", () => {
    test("moving", () => {
      const board = getStartingBoard(3, 4, 1, 1, 0, conf);
      let position = -1;

      iterateBoardCells(board, index => {
        if (isFish(board, index)) {
          position = index;
        }
      });

      expect(position).toBeTruthy;

      computeNextFishState(board, position, { fish: { breedTime: 10 } }, 1);

      let nextPosition = -1;
      iterateBoardCells(board, index => {
        if (isFish(board, index)) {
          nextPosition = index;
        }
      });

      expect(nextPosition).not.toBeNull;
      expect(nextPosition).not.toEqual(position);
    });
  });
});
