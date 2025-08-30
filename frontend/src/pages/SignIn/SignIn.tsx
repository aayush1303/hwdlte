import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import image from '../../assets/home.jpg';
import axios, { AxiosError } from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import { toast } from "sonner";

interface AuthProps {
  toggleForm: () => void;
}

interface GoogleCredentialResponse {
  credential?: string;
}

const SignIn: React.FC<AuthProps> = ({ toggleForm }) => {
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleOtpVisibility = () => setShowOtp(!showOtp);
  const navigate = useNavigate();
  const { setToken, fetchUser } = useUser();

  const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSendOtp = async () => {
    if (!isEmailValid(email)) return;
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/users/send-otp`, { email });
      if (res.data.success) {
        toast.success("OTP sent successfully");
        setOtpSent(true);
      } else {
        toast.error("Failed to send OTP: " + res.data.message);
      }
    } catch (error: any) {
      console.error((error as AxiosError).response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/users/verify-otp`, { email, otp });
      if (res.data.success) {
        toast.success("Logged in successfully");
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        fetchUser();
        navigate("/dashboard");
      } else {
        toast.error("OTP verification failed: " + res.data.message);
      }
    } catch (error: any) {
      console.error((error as AxiosError).response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: GoogleCredentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/users/google`,
        { token: credentialResponse.credential },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Logged in successfully");
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        fetchUser();
        navigate("/dashboard");
      } else {
        toast.error("Login failed: " + res.data.message);
      }
    } catch (error: any) {
      console.error("Error during Google login:", (error as AxiosError).response?.data || error.message);
    }
  };

  return (
    <div className="max-h-screen bg-gray-100 text-gray-900 flex w-full sm:w-auto">
      <div className="max-w-screen m-0 sm:m-6 relative bg-white sm:shadow sm:rounded-lg flex justify-center flex-1">
        <div className="absolute top-4 left-4 lg:left-6">
          <span className="text-xl font-bold text-gray-800">💎 HD</span>
        </div>

        {/* Left Side - Form */}
        <div className="sm:w-1/2 lg:pl-10 xl:w-5/12 mt-40 b-40 m-4 w-full sm:pt-20 sm:pb-20 sm:m-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-600 mb-8">Sign in to enjoy the feature of HD</p>

          <form className="space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type={showOtp ? "text" : "password"}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
              />
              <div
                className="absolute inset-y-0 right-3 top-6 flex items-center cursor-pointer"
                onClick={toggleOtpVisibility}
              >
                {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="flex gap-2">
              {!otpSent && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!isEmailValid(email) || loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 cursor-pointer"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              )}
              {otpSent && (
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Sign In"}
                </Button>
              )}
            </div>
          </form>

          <div className="my-4 flex items-center">
            <hr className="flex-1 border-t border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">or</span>
            <hr className="flex-1 border-t border-gray-300" />
          </div>

          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Google Login Failed")}
            />
          </div>

          <p className="mt-8 text-center text-sm text-gray-600 mb-24">
            Don't have an account?{" "}
            <a onClick={toggleForm} className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
              Sign up
            </a>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="flex-1 hidden sm:flex p-2 ">
          <img
            src={image}
            alt="Illustration"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
