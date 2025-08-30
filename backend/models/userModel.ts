import mongoose, { Document, Schema, Model,Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  otp?: string;
  otpExpires?: Date;
  noteData?: Record<string, any>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpires: { type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) },
    noteData: { type: Object, default: {} },
  },
  { minimize: false }
);

const User: Model<IUser> = mongoose.models.user || mongoose.model<IUser>("user", userSchema);
export default User;
