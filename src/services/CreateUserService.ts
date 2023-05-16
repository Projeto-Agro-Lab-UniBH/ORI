import { api } from "../providers/Api";

type CreateAccountRequest = {
  username: string;
  email: string;
  password: string;
}

type CreateAccountResponse = {
  id: string;
  profile_photo: string;
  username: string;
  email: string;
  password: string;
}

function createUser({ username, email, password }: CreateAccountRequest) {
  return api.post<CreateAccountResponse>('/user', { username, email, password })
}

export const ProfileServices = { createUser }