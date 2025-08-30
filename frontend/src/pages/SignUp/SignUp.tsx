import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import image from '../../assets/home.jpg';
import { useUser } from "../../contexts/userContext";
import { toast } from "sonner";

interface AuthProps {
  toggleForm: () => void;
}

const SignUp: React.FC<AuthProps> = ({ toggleForm }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [dob, setDob] = useState<Date | undefined>(new Date("1997-12-11"));
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [loadingOtp, setLoadingOtp] = useState<boolean>(false);
  const [loadingVerify, setLoadingVerify] = useState<boolean>(false);

  const { fetchUser, setToken } = useUser();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Send OTP API
  const handleSendOtp = async () => {
    if (!isEmailValid(email)) return;
    if (!name.trim()) return toast.error("Name cannot be empty");
    if (!dob) return toast.error("Date of Birth must be selected");

    try {
      setLoadingOtp(true);
      const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/users/send-otp`, {
        email,
        name,
        dob
      });

      if (res.data.success) {
        toast.success("OTP sent successfully");
        setOtpSent(true);
      } else {
        toast.error("Failed to send OTP: " + res.data.message);
      }
    } catch (error: any) {
      console.error((error as AxiosError).response?.data || error.message);
      toast.error("Failed to send OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  // Verify OTP and register user
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("OTP cannot be empty");

    try {
      setLoadingVerify(true);
      const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/users/verify-otp`, { email, otp });
      if (res.data.success) {
        toast.success("Account created and logged in successfully");
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        fetchUser();
        navigate("/dashboard");
      } else {
        toast.error("OTP verification failed: " + res.data.message);
      }
    } catch (error: any) {
      console.error((error as AxiosError).response?.data || error.message);
      toast.error("Error verifying OTP");
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="max-h-screen bg-gray-100 text-gray-900 flex w-full sm:w-auto">
      <div className="max-w-screen m-0 sm:m-6 relative bg-white sm:shadow sm:rounded-lg flex justify-center flex-1">
        <div className="absolute top-4 left-4 lg:left-6">
          <span className="text-xl font-bold text-gray-800">💎 HD</span>
        </div>

        {/* Form */}
        <div className="sm:w-1/2 lg:pl-10 xl:w-5/12 mt-40 b-40 m-4 w-full sm:pt-20 sm:pb-20 sm:m-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h1>
          <p className="text-gray-600 mb-8">Create your account to enjoy HD features</p>

          <form className="space-y-6" onSubmit={handleSignUp}>
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dob} onSelect={setDob} captionLayout="dropdown" />
                </PopoverContent>
              </Popover>
            </div>

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
                type={showPassword ? "text" : "password"}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
              />
              <div
                className="absolute inset-y-0 right-3 top-6 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={!isEmailValid(email) || loadingOtp}
                className="flex-1 bg-blue-600 hover:bg-blue-500 cursor-pointer"
              >
                {loadingOtp ? "Sending..." : "Send OTP"}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 cursor-pointer"
                disabled={loadingVerify}
              >
                {loadingVerify ? "Verifying..." : "Sign Up"}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a onClick={toggleForm} className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
              Sign in
            </a>
          </p>
        </div>

        {/* Image */}
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

export default SignUp;
