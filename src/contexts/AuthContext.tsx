import Router from "next/router";
import Cookies from "js-cookie"; // Use js-cookie para manipular cookies
import jwt_decode from "jwt-decode"; // Verifique o token JWT
import { createContext, useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    // Verifique se o usuário já está autenticado ao carregar a página
    const token = Cookies.get("nextauth.token");
    if (token) {
      try {
        const decodedToken = jwt_decode<DecodedToken>(token);
        if (decodedToken && !isTokenExpired(decodedToken)) {
          // Token válido e não expirado
          api.get(`/user/${decodedToken.sub}`).then((res) => setUser(res.data));
        } else {
          // Token expirado, faça o logout
          logOut();
        }
      } catch (error) {
        // Manipule erros ao decodificar o token
        logOut();
      }
    }
  }, []);

  async function signIn({ email, password }: SignInData) {
    try {
      const { data } = await AuthService.signIn({
        email,
        password,
      });

      // Salve o token JWT nos cookies
      Cookies.set("nextauth.token", data.token, { expires: 1 / 3 }); // Token válido por 8 horas
      
      setUser(data.user);

      // Atualize os cabeçalhos da API com o token
      api.defaults.headers["Authorization"] = `Bearer ${data.token}`;

      // Redirecione para a página do usuário
      Router.push(`/${data.user.id}?page=1`);
    } catch (error) {
      // Trate os erros de login adequadamente
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
  }

  function logOut() {
    // Remova o token dos cookies
    Cookies.remove("nextauth.token");

    // Limpe os cabeçalhos da API
    delete api.defaults.headers["Authorization"];

    // Redirecione para a página de login
    Router.push("/sign-in");
  }

  // Função para verificar se o token JWT está expirado
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
