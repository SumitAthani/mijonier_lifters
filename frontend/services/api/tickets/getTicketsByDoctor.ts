import apiClient from "../apiClient";

export const getTicketsByDoctor = async (doctorId: string) => {
  try {
    const response = await apiClient.get(`/api/tickets/${doctorId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching tickets:", error);
    throw error.response?.data || new Error("Failed to fetch tickets");
  }
};
