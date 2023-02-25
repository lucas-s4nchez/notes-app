import { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import User from "../models/User";

export const addNewNote = async (req: Request, res: Response) => {
  const note = new Note(req.body);

  try {
    note.user = req.uid;

    const savedNote = await note.save();

    res.json({
      ok: true,
      note: savedNote,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
export const getNotes = async (req: Request, res: Response) => {
  const user = await User.findById(req.uid);
  if (!user) {
    throw new Error("User not found");
  }
  const notes = await Note.find({ user: req.uid }).populate("user", {
    username: 1,
  });

  res.status(200).json({
    ok: true,
    notes,
  });
};
export const getNoteById = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const uid = req.uid;
  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una nota con ese id",
      });
    }
    if (note.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No puedes acceder a una nota que no creaste",
      });
    }
    res.json({
      ok: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
export const updateNote = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const uid = req.uid;
  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una nota con ese id",
      });
    }
    if (note.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No puedes editar un nota que no creaste",
      });
    }
    const newNote = {
      ...req.body,
      user: uid,
    } as INote;
    const updatedNote = await Note.findByIdAndUpdate(noteId, newNote, {
      new: true,
    });

    res.json({
      ok: true,
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
export const deleteNote = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const uid = req.uid;
  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una nota con ese id",
      });
    }
    if (note.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No puedes eliminar una nota que no creaste",
      });
    }

    await Note.findByIdAndDelete(noteId);

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
