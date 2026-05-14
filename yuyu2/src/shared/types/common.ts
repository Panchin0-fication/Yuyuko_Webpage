export interface endingSprite {
  hidden: boolean;
  id: string;
}
export interface previewImageDimensions {
  width: number;
  height: number;
  multiplier: number;
}
export interface change {
  type:
    | "name"
    | "validated"
    | "eliminated"
    | "added"
    | "newAdded"
    | "newEliminated";
  previous: string;
  actual: string;
  category: "general" | "character" | "artist" | "copyright";
  status:
    | "accepted"
    | "pending"
    | "takenDown"
    | "rejected"
    | "validating"
    | "adminAdded";
}
export type fieldsFanArtsInput = {
  clasification: "general" | "sensitive" | "explicit";
  originalLink: string;
};
