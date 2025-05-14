
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { loginUser, signupUser } from "@/lib/api";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    try {
      const result = await loginUser(email, password);
      
      if (!result.success) {
        toast.error(result.error || "Invalid credentials");
        return false;
      }

      const userData = { name: result.name!, email: result.email! };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const result = await signupUser(name, email, password);
      
      if (!result.success) {
        toast.error(result.error || "Signup failed");
        return false;
      }

      const userData = { name: result.name!, email: result.email! };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      toast.success("Account created successfully");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
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
