import React, { createContext, useContext, useState } from "react";
import { IAuthContext, IUser } from "../interfaces";
import { AuthService } from "../services";

export const AuthContext = createContext<IAuthContext>(undefined!);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | undefined>();
  const [token, setToken] = useState<string>();

  async function login(email: string, password: string) {
    const { status, data } = await AuthService.login(email, password);

    if (status === 200) {
      setToken(data.token);
      setUser(data.user);
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, login }}>
      {children}
    </AuthContext.Provider>
  );
}
