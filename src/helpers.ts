import seedrandom from "seedrandom";

let rng = seedrandom();

export const useSeed = () => {
  rng = seedrandom("wator-seed");
};

export const removeSeed = () => {
  rng = seedrandom();
};

/**
 * Returns integer number between min and max (excluding)
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(rng.quick() * (max - min)) + min;
};

export const getRandomListItem = <T>(list: Array<T>): null | T =>
  list[getRandomInt(0, list.length)] || null;
