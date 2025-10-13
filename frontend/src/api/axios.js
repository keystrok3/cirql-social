import axios from "axios";

// ==========================
//  Public API (no auth)
// ==========================
export const api = axios.create({
  baseURL: "/api/auth/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // allows sending/receiving cookies
});

// ==========================
//  Authenticated API
// ==========================
export const apiAuth = axios.create({
  baseURL: "/api/",
  withCredentials: true, // include cookies if needed
});

// ==========================
//  Token Refresh Logic
// ==========================
const refreshTokenCall = async () => {
  try {
    // Send empty body, but include credentials (cookies)
    const response = await axios.post(
      "/api/auth/refresh-token/",
      {},
      { withCredentials: true }
    );

    const newAccessToken = response.data.access_token;
    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    throw error;
  }
};

// ==========================
//  Request Interceptor
// ==========================
apiAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==========================
//  Response Interceptor
// ==========================
let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

apiAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    if (!response) return Promise.reject(error); // Network error

    // If 401 and request not already retried
    if (response.status === 401 && !config._retry) {
      config._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newAccessToken = await refreshTokenCall();
          isRefreshing = false;
          onRefreshed(newAccessToken);

          // Retry original request with new token
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiAuth(config);
        } catch (err) {
          isRefreshing = false;
          subscribers = [];
          console.error("Token refresh failed, logging out...");
          // Optional: trigger logout logic here
          return Promise.reject(err);
        }
      }

      // If a refresh is already in progress, wait until it's done
      return new Promise((resolve) => {
        addSubscriber((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          resolve(apiAuth(config));
        });
      });
    }

    return Promise.reject(error);
  }
);
