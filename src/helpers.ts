import seedrandom from "seedrandom";

let rng = seedrandom();

export const useSeed = () => {
  rng = seedrandom("wator-seed");
};

export const removeSeed = () => {
  rng = seedrandom();
};

/**
 * Returns integer number between min and max (including)
 */
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng() * (max - min + 1)) + min;
};

export const getRandomListItem = <T>(list: Array<T>): null | T =>
  list[getRandomInt(0, list.length - 1)] || null;
