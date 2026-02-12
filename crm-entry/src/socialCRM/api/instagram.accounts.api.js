import api from "./apiClient";

/**
 * Instagram Account APIs
 */

// GET /api/instagram/accounts
export const getInstagramAccounts = async () => {
  const response = await api.get("/instagram/accounts");
  return response.data;
};

// POST /api/instagram/accounts/{instagramBusinessId}/activate
export const activateInstagramAccount = async (instagramBusinessId) => {
  const response = await api.post(`/instagram/accounts/${instagramBusinessId}/activate`);
  return response.data;
};
