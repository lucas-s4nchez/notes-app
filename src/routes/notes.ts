import {
  addNewNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../controllers/notes";
import { Router } from "express";
import jwtValidator from "../middlewares/jwtValidator";
const router = Router();

router.use(jwtValidator);

router.get("/", getNotes);
router.post("/", addNewNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
