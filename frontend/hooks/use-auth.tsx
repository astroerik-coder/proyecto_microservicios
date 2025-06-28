"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authAPI } from "@/lib/api";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  login: (data: { nombreUsuario: string; contraseña: string }) => Promise<void>;
  logout: () => void;
  register: (data: {
    nombreUsuario: string;
    correo: string;
    contraseña: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token encontrado, cargando perfil...");
      authAPI
        .perfil()
        .then((perfil) => {
          console.log("Perfil cargado:", perfil);
          setUser(perfil);
        })
        .catch((error) => {
          console.error("Error al cargar perfil:", error);
          localStorage.removeItem("token");
        });
    } else {
      console.log("No hay token en localStorage");
    }
  }, []);

  const login = async ({
    nombreUsuario,
    contraseña,
  }: {
    nombreUsuario: string;
    contraseña: string;
  }) => {
    const res = await authAPI.login({ nombreUsuario, contraseña });

    if (!res.ok) {
      const error = await res.text();
      throw new Error("Login fallido: " + error);
    }

    const result = await res.json();
    localStorage.setItem("token", result.token);

    const perfil = await authAPI.perfil();
    setUser(perfil);
  };

  const register = async (data: {
    nombreUsuario: string;
    correo: string;
    contraseña: string;
  }) => {
    const res = await authAPI.register({
      ...data,
      rol: "CLIENTE",
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error("Registro fallido: " + error);
    }

    const result = await res.json();
    localStorage.setItem("token", result.token);

    const perfil = await authAPI.perfil();
    setUser(perfil);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
