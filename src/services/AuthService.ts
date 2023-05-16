import { User } from "../interfaces/User";
import { api } from "../providers/Api";

type SignInRequest = {
  email: string; 
  password: string;
}

type SignInResponse = {
  user: User;
  token: string;
}

function signIn({ email, password }: SignInRequest) {
  return api.post<SignInResponse>('/auth/signin', { email, password })
}

export const AuthService = { signIn }