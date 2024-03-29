import axios from "axios";
import { parseCookies } from "nookies";

function getAPIClient(ctx?: any) {
  const { "nextauth.token": token } = parseCookies(ctx);

  const api = axios.create({ baseURL: "http://localhost:5000" });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  return api;
}

export const api = getAPIClient();