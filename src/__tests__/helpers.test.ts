import { getRandomInt, getRandomListItem, useSeed } from "../helpers";

describe("getRandomInt", () => {
  test("when min and max is the same, returns that number", () => {
    expect(getRandomInt(2, 2)).toEqual(2);
  });

  test("returns number between min and max (excluding borders)", () => {
    useSeed();
    expect(getRandomInt(2, 3)).toEqual(2);
    expect(getRandomInt(2, 3)).toEqual(2);
    expect(getRandomInt(2, 3)).toEqual(2);
    expect(getRandomInt(2, 3)).toEqual(2);
  });
});

describe("getRandomListItem", () => {
  test("returns the only array item", () => {
    expect(getRandomListItem([1])).toEqual(1);
  });

  test("returns some item", () => {
    useSeed();
    expect(getRandomListItem([1, 2, 3])).toEqual(2);
    expect(getRandomListItem([1, 2, 3])).toEqual(1);
    expect(getRandomListItem([1, 2, 3])).toEqual(2);
    expect(getRandomListItem([1, 2, 3])).toEqual(2);
    expect(getRandomListItem([1, 2, 3])).toEqual(3);
  });

  test("never out of the range", () => {
    expect(getRandomListItem([1, 2])).not.toBeUndefined();
    expect(getRandomListItem([1, 2])).not.toBeUndefined();
    expect(getRandomListItem([1, 2])).not.toBeUndefined();
    expect(getRandomListItem([1, 2])).not.toBeUndefined();
    expect(getRandomListItem([1, 2])).not.toBeUndefined();
    expect(getRandomListItem([1, 2])).not.toBeUndefined();
    expect(getRandomListItem([1, 2])).not.toBeUndefined();
    expect(getRandomListItem([1, 2])).not.toBeUndefined();
    expect(getRandomListItem([1, 2])).not.toBeUndefined();
  });

  test("return null on an empty list", () => {
    expect(getRandomListItem([])).toBeNull();
  });
});
