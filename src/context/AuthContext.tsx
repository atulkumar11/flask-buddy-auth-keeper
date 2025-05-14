
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

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
      // This would normally be an API call to Flask
      if (password.length < 6) {
        toast.error("Invalid credentials");
        return false;
      }

      // Check if user exists in localStorage (simulating a database)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser || foundUser.password !== password) {
        toast.error("Invalid credentials");
        return false;
      }

      const userData = { name: foundUser.name, email: foundUser.email };
      
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
      // This would normally be an API call to Flask
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }

      // Check if email already exists (simulating a database)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some((u: any) => u.email === email)) {
        toast.error("Email already registered");
        return false;
      }

      // Add user to "database"
      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Auto login after signup
      const userData = { name, email };
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
