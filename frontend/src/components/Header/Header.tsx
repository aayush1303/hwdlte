import React from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { toast } from "sonner";
import { Button } from "../../components/ui/button"; 
import { useUser } from "../../contexts/userContext"; 

// Define the shape of the user object
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the context type
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const Header: FC = () => {
  const { user, setUser, setToken } = useUser() as UserContextType;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setUser(null); 
    setToken(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center pb-5 bg-white">
      {/* Logo / App Name */}
      <div className="text-xl font-bold text-gray-800">💎 HD</div>

      {/* User Info */}
      {user ? (
        <div className="flex items-center gap-4">
          {/* Account Icon */}
          <FaUserCircle className="text-purple-500 text-3xl" />

          {/* Logout Button using ShadCN */}
          <Button size="sm" onClick={handleLogout} className="cursor-pointer">
            <CiLogout />
          </Button>
        </div>
      ) : (
        <span className="text-gray-500">Not logged in</span>
      )}
    </div>
  );
};

export default Header;
