import {type withUserData} from "@shared"
export async function ValidateSession(token: String | null) {
  const cleanToken = token ? token.replace(/^"|"$/g, "") : "";
  const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      "Content-Type": "application/json",
    },
  });
  const res = (await response.json()) as withUserData;
  return res
}
