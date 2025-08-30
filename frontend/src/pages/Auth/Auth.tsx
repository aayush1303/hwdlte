import { useState } from "react";
import type { FC } from "react";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";

// Define props type for SignIn and SignUp
export interface AuthFormProps {
  toggleForm: () => void;
}

const Auth: FC = () => {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);

  const toggleForm = () => setIsSignIn(!isSignIn);

  return (
    <div className="min-h-screen flex justify-center items-center">
      {isSignIn ? (
        <SignIn toggleForm={toggleForm} />
      ) : (
        <SignUp toggleForm={toggleForm} />
      )}
    </div>
  );
};

export default Auth;
