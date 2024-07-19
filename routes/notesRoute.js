import express from "express";
import {
  createNoteController,
  getAllNotesController,
  getNoteByIdController,
  updateNoteController,
  deleteNoteController,
  upadtingBinController,
  getTrashedNotesController,
  upadtingArchiveController,
  getArchivedNotesController,
} from "../controllers/notesController.js";

const route = express.Router();

route.post("/create", createNoteController);
route.get("/all-notes", getAllNotesController);
route.get("/get-note/:id", getNoteByIdController);
route.put("/edit/:id", updateNoteController);
route.delete("/delete/:id", deleteNoteController);
route.put("/:id/archived", upadtingArchiveController);
route.get("/archived", getArchivedNotesController);
route.put("/:id/trash", upadtingBinController);
route.get("/trashed", getTrashedNotesController);

export default route;
