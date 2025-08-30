import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import validator from "validator";
import User, { IUser } from "../models/userModel";
import { sendMail } from "../config/mailer";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: { id: string };
}

// ---------- Utility Functions ----------
const generateOtp = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

const createToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

// ---------- OTP LOGIN ----------
export const sendOtp = async (req: Request, res: Response) => {
  const { name, email }: { name?: string; email: string } = req.body;

  try {
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    let user: IUser | null = await User.findOne({ email });

    // If user not found → create
    if (!user) {
      if (!name) {
        return res.json({ success: false, message: "Name is required for new users" });
      }
      user = new User({ name, email });
    }

    // Generate OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    await sendMail(email, "Your OTP Code", `Your OTP code is: ${otp}`);
    console.log(`OTP for ${email}: ${otp}`);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp }: { email: string; otp: string } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = createToken(user._id.toString());
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// ---------- GOOGLE LOGIN ----------
export const googleLogin = async (req: Request, res: Response) => {
  const { token }: { token: string } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email!;
    const name = payload?.name!;

    let user: IUser | null = await User.findOne({ email });

    if (!user) {
      // New user via Google
      user = await User.create({ name, email, google: true });
    } else if (!(user as any).google) {
      // Existing user, now linking Google
      (user as any).google = true;
      await user.save();
    }

    const jwtToken = createToken(user._id.toString());

    res.json({ success: true, token: jwtToken, user: { id: user._id, name, email } });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Google login failed" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-otp -otpExpires");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, otpExpires: user.otpExpires },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
