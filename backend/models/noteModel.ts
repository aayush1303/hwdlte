import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./userModel";

export interface INote extends Document {
  user: IUser["_id"];
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema: Schema<INote> = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>("Note", noteSchema);
export default Note;
