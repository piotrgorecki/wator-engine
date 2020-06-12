import { Cell } from "./cell";

export type FishId = 1;
export const FISH_ID: FishId = 1;

// [ID, age, state version]
export type Fish = [FishId, number, boolean];

export const isFish = (toBeDetermined: Cell): toBeDetermined is Fish =>
  toBeDetermined[0] === FISH_ID;

export const getNewFish = (stateVersion: boolean): Fish => [
  FISH_ID,
  0,
  stateVersion,
];

export const isBreedTime = (fish: Fish, bredTime: number) =>
  fish[1] >= bredTime;

export const resetBreedTime = (fish: Fish) => {
  fish[1] = 0;
};

export const incAge = (fish: Fish) => {
  fish[1] = fish[1] + 1;
};
