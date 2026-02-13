import { BASE_URL } from "./apiClient";

// Generic connect function (recommended)
const connect = (platform) => {
  const token = localStorage.getItem("accessToken");
  const returnUrl = window.location.pathname;

  window.location.href =
    `${BASE_URL}/auth/${platform}/connect?access_token=${token}&returnUrl=${encodeURIComponent(returnUrl)}`;
};

// Facebook
export const connectFacebook = () => {
  connect("facebook");
};

// LinkedIn
export const connectLinkedIn = () => {
  connect("linkedin");
};

// Instagram (uses Facebook OAuth)
export const connectInstagram = () => {
  connect("facebook");
};

// Optional generic export
export const connectPlatform = (platform) => {
  connect(platform);
};
