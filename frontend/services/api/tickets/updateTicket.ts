import apiClient from "../apiClient";

export const updateTicketService = async (
  ticketId: string,
  data: {
    status: string;
  }
) => {
  try {
    const response = await apiClient.put(
      `/api/tickets/${ticketId}`,
      data
    );
    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Failed to update ticket"
    );
  }
};
