import { ILoginResponse } from "../interfaces";
import { Api } from "../providers";

function login(email: string, password: string) {
  return Api.post<ILoginResponse>('/api/v1/login', { email, password })
}

export const AuthService = {
  login
}