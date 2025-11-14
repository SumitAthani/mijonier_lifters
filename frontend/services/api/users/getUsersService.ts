import apiClient from "../apiClient";

export const getPatientsService = async () => {
  try {
    const response = await apiClient.get("/api/users");

    console.log("response:",response.data)
    return response.data; // expect { success, users }
  } catch (error: any) {
    console.error("Get users error:", error);

    throw new Error(
      error?.response?.data?.message ||
        "Failed to fetch users"
    );
  }
};
