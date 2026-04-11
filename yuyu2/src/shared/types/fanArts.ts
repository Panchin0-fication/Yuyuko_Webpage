export interface fanArt {
  id: string;
  src: string;
  tags: string[];
  artists: string[];
  caracters: string[];
  clasification: "general" | "sensitive" | "explicit";
  show: boolean;
  originalLink: string;
  status: "accepted" | "pending" | "takenDown" | "rejected";
  uploader: { username: string; id: string };
}
export interface fanArtReducedQuality {
  src: string;
  height: number;
  width: number;
  index: number;
  wasReduced: boolean;
}
export interface returnedReducedQuality {
  reduced: string;
  width: number;
  height: number;
  changed: boolean;
}
