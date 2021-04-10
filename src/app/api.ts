import config from "./config";

const request = async (input: RequestInfo, init: RequestInit = {}) => {
  const headers = new Headers([
    ["Content-Type", "application/json"],
    ["Accept", "application/json"],
  ]);
  for (const header of Object.entries(init.headers || {})) {
    headers.append(...header);
  }

  if (typeof input === "string" && input.includes(config.API_SERVER_URI)) {
    headers.append("x-api-key", config.API_KEY);
  }

  return fetch(input, {
    mode: "cors",
    ...init,
    headers,
  });
};

export default request;
