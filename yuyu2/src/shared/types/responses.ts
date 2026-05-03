import { type fanArt } from "@shared";
export interface response {
  code: string;
  success: boolean;
}

export interface withToken extends response {
  token: string | null;
}

export interface simpleTag {
  name: string;
  category: "general" | "character" | "artist" | "copyright";
}

export interface preferences {
  language: string;
  showExplicit: boolean;
  hideTags: simpleTag[];
}

export interface userData {
  id: string;
  role: string;
  userName: string;
  email: string;
  verified: boolean;
  verification_token: string;
  reset_password_token: string;
  preferences: preferences;
}

export interface withUserData extends response {
  user_data: userData;
}

export interface withUrl extends response {
  url: string;
}

export interface withFanArt extends response {
  fanArts: fanArt[];
}
