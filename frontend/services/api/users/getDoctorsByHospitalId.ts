import apiClient from "../apiClient";

export const getDoctorsByHospitalId = async (hospitalId: string) => {
  try {
    const response = await apiClient.get(`/api/doctors/${hospitalId}`);
    return response; // Expected format: { success, message, doctors }
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};
