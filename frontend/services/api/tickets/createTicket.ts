import apiClient from "../apiClient";

export const createTicket = async (data: {
  messages?: any[];
  userIds?: string[];
  patient?: any;
  title: string;
}) => {
  try {
    const payload = {
      title: data.title ||"New Ticket", // dummy text
      messages: data?.messages || [],
      userIds: data?.userIds || [],
      patient: data?.patient || null,
    };

    const response = await apiClient.post("/api/tickets", payload);
    return response.data; // expected: { success, message, ticket }
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
