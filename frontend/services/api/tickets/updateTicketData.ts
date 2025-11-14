import apiClient from "../apiClient";

export const updateTicketData = async (
  ticketId: string,
  data: {
    newDoctorId: string;
    sentBy: string;
    message: string;
  }
) => {
  try {
    const payload = {
      newDoctorId: data.newDoctorId,
      sentBy: data.sentBy,
      message: data.message,
    };

    const response = await apiClient.patch(`/api/tickets/${ticketId}`, payload);

    return response.data; // expected: { success, message, updatedTicket }
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
