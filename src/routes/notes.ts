import {
  addNewNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controllers/notes";
import { Router } from "express";
import jwtValidator from "../middlewares/jwtValidator";
import { notesValidator } from "../validators/notes";
const router = Router();

router.use(jwtValidator);

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.post("/", notesValidator, addNewNote);
router.put("/:id", notesValidator, updateNote);
router.delete("/:id", deleteNote);

export default router;
