import api from "./apiClient";

/**
 * Facebook Post Analytics APIs
 */

// GET /api/analytics/facebook/posts
export const getFacebookPosts = async () => {
  const response = await api.get("/analytics/facebook/posts");
  return response.data;
};

// GET /api/analytics/facebook/posts/top
export const getTopFacebookPosts = async () => {
  const response = await api.get("/analytics/facebook/posts/top");
  return response.data;
};

// GET /api/analytics/facebook/posts/overview
export const getFacebookPostsOverview = async () => {
  const response = await api.get("/analytics/facebook/posts/overview");
  return response.data;
};

// GET /api/analytics/facebook/posts/engagement-trend
export const getFacebookEngagementTrend = async () => {
  const response = await api.get("/analytics/facebook/posts/engagement-trend");
  return response.data;
};

// GET /api/analytics/facebook/posts/best-time
export const getBestTimeToPost = async () => {
  const response = await api.get("/analytics/facebook/posts/best-time");
  return response.data;
};

// GET /api/analytics/facebook/posts/best-day
export const getBestDayToPost = async () => {
  const response = await api.get("/analytics/facebook/posts/best-day");
  return response.data;
};
