import { type ReactNode } from "react";
export async function ValidateSession(token: String | null) {
  const cleanToken = token ? token.replace(/^"|"$/g, "") : "";
  const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();
  if (res.type === "Expired") {
    return {
      type: "Error",
      reason: "Expired",
      message: res.message,
    };
  } else if (res.type === "Success") {
    return {
      type: "Success",
      data: { userName: res.data["userName"], verified: res.data["verified"] },
      message: "Verification successful",
    };
  }
}
