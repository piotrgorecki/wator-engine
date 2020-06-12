import { Cell } from "./cell";

export type SharkId = 2;
export const SHARK_ID: SharkId = 2;

// [ID, energy, state version]
export type Shark = [SharkId, number, boolean];

export const isShark = (toBeDetermined: Cell): toBeDetermined is Shark =>
  toBeDetermined[0] === SHARK_ID;

export const getNewShark = (
  startingEnergy: number,
  stateVersion: boolean
): Shark => [SHARK_ID, startingEnergy, stateVersion];

export const decEnergy = (shark: Shark) => {
  shark[1] = shark[1] - 1;
};

export const isSharkBreedTime = (shark: Shark, energyLevel: number) =>
  shark[1] >= energyLevel;

export const eatFish = (shark: Shark, energyBonus: number) => {
  shark[1] = shark[1] + energyBonus;
};

export const breadShark = (shark: Shark, startingEnergy: number) => {
  shark[1] = startingEnergy;
};

export const isDead = (shark: Shark) => shark[1] <= 0;
