import api from "./apiClient";

/**
 * LinkedIn Organization APIs
 */

// GET /api/linkedin/orgs
export const getLinkedInOrgs = async () => {
  const response = await api.get("/linkedin/orgs");
  return response.data;
};

// POST /api/linkedin/orgs/select
export const selectLinkedInOrg = async (orgId) => {
  const response = await api.post("/linkedin/orgs/select", { orgId });
  return response.data;
};
