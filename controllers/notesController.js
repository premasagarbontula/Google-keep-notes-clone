import notesModel from "../models/notesModel.js";

// Create a new note
export const createNoteController = async (req, res) => {
  try {
    const { title, content, color, tags } = req.body;
    const newNote = new notesModel({
      title,
      content,
      color: color || "#e66465", // Default to #e66465 if color is not provided
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      archived: false,
      trashed: false,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all notes
export const getAllNotesController = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const notes = await notesModel.find({
      archived: false,
      trashed: false,
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
        { labels: { $regex: searchQuery, $options: "i" } },
      ],
    });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single note
export const getNoteByIdController = async (req, res) => {
  try {
    const note = await notesModel.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a note
export const updateNoteController = async (req, res) => {
  try {
    const { title, content, color, tags, archived, trashed } = req.body;

    const updatedNote = await notesModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        color,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        archived,
        trashed,
      },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a note
export const deleteNoteController = async (req, res) => {
  try {
    const deletedNote = await notesModel.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get archived notes
export const getArchivedNotesController = async (req, res) => {
  try {
    const archivedNotes = await notesModel.find({
      archived: true,
      trashed: false,
    });
    if (!archivedNotes) {
      return res.status(404).json({ message: "Archieved Notes not found" });
    }
    res.json(archivedNotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Archive a note
export const upadtingArchiveController = async (req, res) => {
  notesModel.findById(req.params.id).then((note) => {
    if (note) {
      note.archived = true;
      note.save().then((updatedNote) => res.json(updatedNote));
    } else {
      res.status(404).json({ notefound: "Note not found" });
    }
  });
};

// Get trashed notes
export const getTrashedNotesController = async (req, res) => {
  try {
    const trashedNotes = await notesModel.find({
      trashed: true,
      trashedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });
    if (!trashedNotes) {
      return res.status(404).json({ message: "Trashed Notes not found" });
    }
    res.json(trashedNotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Trash a note
export const upadtingBinController = async (req, res) => {
  notesModel.findById(req.params.id).then((note) => {
    if (note) {
      note.trashed = true;
      note.trashedAt = Date.now();
      note.updatedAt = Date.now();

      note.save().then((updatedNote) => res.json(updatedNote));
    } else {
      res.status(404).json({ notefound: "Note not found" });
    }
  });
};
