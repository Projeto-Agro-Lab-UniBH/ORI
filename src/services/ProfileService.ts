import { User } from "../interfaces/User";
import { api } from "../providers/Api";

type UserDataStoredinTokenResponse = {
  user: User
}

function getUserDataStoredinToken() {
  return api.get<UserDataStoredinTokenResponse>('/user/me')
}

export const ProfileService = { getUserDataStoredinToken }