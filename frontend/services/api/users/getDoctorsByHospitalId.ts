import apiClient from "../apiClient";

export const getDoctorsByHospitalId = async (hospitalId: string,userId: string) => {
  try {
    const response = await apiClient.get(`/api/doctors/${hospitalId}?userId=${userId}`);
    return response; // Expected format: { success, message, doctors }
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
