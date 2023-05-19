import { api } from "../providers/Api";

type UserDataStoredinTokenResponse = {
  id: string;
  profile_photo: string;
  username: string;
  email: string;
}

function getUserDataStoredinToken() {
  return api.get<UserDataStoredinTokenResponse>('/user/me')
}

export const ProfileService = { getUserDataStoredinToken }