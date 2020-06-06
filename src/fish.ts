export type Fish = {
  age: number;
  _type: "fish";
};

export const isFish = (toBeDetermined: any): toBeDetermined is Fish =>
  toBeDetermined._type === "fish";

export const getNewFish = (): Fish => ({ age: 0, _type: "fish" });

export const isBreedTime = (fish: Fish, bredTime: number) =>
  fish.age >= bredTime;

export const resetBreedTime = (fish: Fish) => (fish.age = 0);

export const incAge = (fish: Fish) => fish.age++;
