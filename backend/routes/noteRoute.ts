// noteRoute.ts
import express from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController";
import authMiddleware from "../middleware/auth";

const noteRouter = express.Router();

noteRouter.use(authMiddleware);

noteRouter.post("/", createNote);
noteRouter.get("/", getNotes);
noteRouter.get("/:id", getNote);
noteRouter.put("/:id", updateNote);
noteRouter.delete("/:id", deleteNote);

export default noteRouter;
