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
  type: "name" | "validated" | "eliminated";
  previous: string;
  actual: string;
}
export type fieldsFanArtsInput = {
  clasification: "general" | "sensitive" | "explicit";
  originalLink: string;
};
