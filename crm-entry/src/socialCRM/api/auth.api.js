import { BASE_URL } from "./apiClient";

export const connectFacebook = () => {
  const token = localStorage.getItem("accessToken");

  // Pass JWT via query param ONLY for connect step
  window.location.href =
    `${BASE_URL}/auth/facebook/connect?access_token=${token}`;
};

// Generic platform connection
export const connectPlatform = (platform) => {
  const token = localStorage.getItem("accessToken");
  
  // Redirect to platform-specific OAuth
  window.location.href =
    `${BASE_URL}/auth/${platform}/connect?access_token=${token}`;
};

// Connect LinkedIn
export const connectLinkedIn = () => {
  const token = localStorage.getItem("accessToken");
  window.location.href =
    `${BASE_URL}/auth/linkedin/connect?access_token=${token}`;
};

// Connect Instagram (via Facebook)
export const connectInstagram = () => {
  connectFacebook(); // Instagram uses Facebook OAuth
};

