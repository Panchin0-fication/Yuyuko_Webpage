export interface tag {
    name:string;
    category:"general" | "character" | "artist" | "copyright";
    status: "accepted" | "pending" | "takenDown" | "rejected";
}
export interface tagWithId extends tag {
    id:string;
}