import Engine, {
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
      const board = getStartingBoard(3, 4, 1, 0, 0, conf);
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

  describe("engine", () => {
    test("starting engine state", () => {
      const engine = new Engine([3, 3], 2, 3, conf);

      expect(engine.conf).toEqual(conf);
      expect(engine.stateVersion).toEqual(0);
      expect(engine.board).not.toBeUndefined;

      const board = engine.board;
      let fish = 0,
        sharks = 0;

      iterateBoardCells(board, cellIndex => {
        if (isFish(board, cellIndex)) {
          fish++;
        } else if (isShark(board, cellIndex)) {
          sharks++;
        }
      });

      expect(fish).toEqual(2);
      expect(sharks).toEqual(3);
    });

    test("getBoardStats", () => {
      const engine = new Engine([3, 3], 4, 2, conf);
      const { fish, shark } = engine.getBoardStats();

      expect(fish).toEqual(4);
      expect(shark).toEqual(2);
    });

    test("individuals moved in the next state", () => {
      const engine = new Engine([3, 3], 1, 1, conf);
      let fishIndex,
        sharkIndex = null;

      iterateBoardCells(engine.board, cellIndex => {
        if (isFish(engine.board, cellIndex)) {
          fishIndex = cellIndex;
        } else if (isShark(engine.board, cellIndex)) {
          sharkIndex = cellIndex;
        }
      });

      expect(fishIndex).not.toBeNull();
      expect(sharkIndex).not.toBeNull();

      engine.nextState();

      expect(engine.stateVersion).toEqual(1);

      let nextFishIndex,
        nextSharkIndex = null;

      iterateBoardCells(engine.board, cellIndex => {
        if (isFish(engine.board, cellIndex)) {
          nextFishIndex = cellIndex;
        } else if (isShark(engine.board, cellIndex)) {
          nextSharkIndex = cellIndex;
        }
      });

      expect(nextFishIndex).not.toEqual(fishIndex);
      expect(nextSharkIndex).not.toEqual(sharkIndex);
    });
  });
});
