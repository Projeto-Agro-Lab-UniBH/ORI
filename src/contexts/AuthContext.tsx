import React, { createContext, useContext, useEffect, useState } from "react";
import Router from "next/router";
import { AuthService } from "../services/AuthService";
import { parseCookies, setCookie } from "nookies"
import { api } from "../providers/Api";
import jwt_decode from "jwt-decode"

type SignInData = {
  email: string, 
  password: string
}

type User = {
  id: string;
  profile_photo: string;
  username: string;
  email: string;
  sub?: string;
}

type AuthContext = {
  isAuthenticated: boolean
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  logOut: () => void;
}

export const AuthContext = createContext({} as AuthContext);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()
    
    if (token) {
      const id = jwt_decode<User>(token).sub
      api.get(`/user/${id}`).then(res => setUser(res.data))
    }
  }, [])

  async function signIn({ email, password }: SignInData) {
    const { data } = await AuthService.signIn({
      email, 
      password
    });

    setCookie(undefined, 'nextauth.token', data.token, {
      maxAge: 60 * 60 * 8
    })

    setUser(data.user)

    api.defaults.headers['Authorization'] = `Bearer ${data.token}`

    Router.push(`/${data.user.id}?page=1`)
  }
  
  function logOut() {
    setCookie(undefined, 'nextauth.token', "", {
      maxAge: 0
    })

    api.defaults.headers['Authorization'] = ""

    Router.push('/sign-in')
  } 

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}