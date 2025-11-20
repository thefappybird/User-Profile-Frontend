import type { EditInput, User } from "./types/user";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export interface UpdateResponse {
  message: string;
  currentUser: User;
}
export const userService = {
  async updateUser(id: string, data: EditInput): Promise<UpdateResponse> {
    try {
      // Clean the data before sending
      const cleaned = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );

      const response = await fetch(
        `${API_BASE_URL}/auth-user/update-user/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleaned),
        }
      );

      if (!response.ok) throw new Error("Update failed");
      return response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
