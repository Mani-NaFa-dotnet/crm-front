import api from "./apiClient";

/**
 * LinkedIn Post API
 */

// POST /api/linkedin/post
export const createLinkedInPost = async (postData) => {
  const response = await api.post("/linkedin/post", postData);
  return response.data;
};
