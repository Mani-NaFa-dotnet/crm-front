import api from "./apiClient";

/**
 * Facebook Analytics API
 * GET /api/analytics/facebook/page
 */
export const getFacebookPageAnalytics = async () => {
  const response = await api.get("/analytics/facebook/page");
  return response.data;
};
