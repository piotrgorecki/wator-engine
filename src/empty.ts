export type Empty = { _type: "empty" };

export const EmptyCell: Empty = { _type: "empty" };

export const isEmpty = (toBeDetermined: any): toBeDetermined is Empty =>
  toBeDetermined._type === "empty";
