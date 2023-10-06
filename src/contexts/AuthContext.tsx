import Router from "next/router";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../providers/Api"; 
import { toast } from "react-toastify";
import { AuthService } from "../services/AuthService";

type User = {
  id: string;
  profile_photo: string;
  username: string;
  email: string;
  sub?: string;
};

type SignInData = {
  email: string;
  password: string;
};

// Define tipos para o token JWT
type DecodedToken = {
  sub: string;
  exp: number;
}

type AuthContext = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (data: SignInData) => Promise<void>;
  logOut: () => void;
};

export const AuthContext = createContext({} as AuthContext);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const signIn = useCallback(async ({ email, password }: SignInData) => {
    try {
      const { data } = await AuthService.signIn({
        email,
        password,
      });

      Cookies.set("nextauth.token", data.token, { expires: 1 / 3 });
      setUser(data.user);

      api.defaults.headers["Authorization"] = `Bearer ${data.token}`;

      Router.push("/dashboard");
    } catch (error) {
      toast.error("Falha ao fazer login. Verifique suas credenciais.", {
        position: "bottom-right",
        autoClose: 2500,
        style: {
          backgroundColor: "#212529",
          fontFamily: "Inter, sans-serif",
          fontWeight: "500",
          fontSize: "12px",
          color: "#f87171",
        },
        progressStyle: {
          backgroundColor: "#f87171",
        },
      });
    }
  }, []);

  const logOut = useCallback(() => {
    Cookies.remove("nextauth.token");
    delete api.defaults.headers["Authorization"];
    Router.push("/sign-in");
  }, []);

  useEffect(() => {
    const token = Cookies.get("nextauth.token");
    if (token) {
      try {
        const decodedToken = jwt_decode<DecodedToken>(token);
        if (decodedToken && !isTokenExpired(decodedToken)) {
          api.get(`/user/${decodedToken.sub}`).then((res) => setUser(res.data));
        } else {
          logOut();
        }
      } catch (error) {
        logOut();
      }
    }
  }, [logOut]);

  function isTokenExpired(decodedToken: DecodedToken): boolean {
    const now = Date.now() / 1000;
    return decodedToken.exp ? now > decodedToken.exp : false;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
