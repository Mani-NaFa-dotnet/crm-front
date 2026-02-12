import api from "./apiClient";

/**
 * Facebook Webhook APIs
 */

// GET /api/webhooks/facebook
export const getFacebookWebhooks = async () => {
  const response = await api.get("/webhooks/facebook");
  return response.data;
};

// POST /api/webhooks/facebook
export const createFacebookWebhook = async (webhookData) => {
  const response = await api.post("/webhooks/facebook", webhookData);
  return response.data;
};
