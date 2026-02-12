import api from "./apiClient";

/**
 * Instagram Post Status API
 */

// GET /api/instagram/posts/{creationId}/status
export const getInstagramPostStatus = async (creationId) => {
  const response = await api.get(`/instagram/posts/${creationId}/status`);
  return response.data;
};
