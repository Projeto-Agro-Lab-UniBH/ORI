import { IUser } from "./IUserData";

export interface ILoginResponse {
  user: IUser;
  token: string;
}