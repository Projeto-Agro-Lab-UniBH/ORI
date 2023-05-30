import { api } from "../providers/Api";

type User = {
  id: string;
  profile_photo: string;
  username: string;
  email: string;
}

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