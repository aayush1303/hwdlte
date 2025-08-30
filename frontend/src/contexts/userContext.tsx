import { createContext, useContext, useState, useEffect } from "react";
import { type ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // Fetch user details from backend if token exists
  const fetchUser = async () => {
    const storedToken = token || localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(res.data.user);
        setToken(storedToken);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); 

  return (
    <UserContext.Provider value={{ user, token, setUser, setToken, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
