import { check } from "express-validator";
import fieldValidator from "../middlewares/fieldValidator";

export const notesValidator = [
  check("title")
    .not()
    .isEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3 })
    .withMessage("El título debe tener al menos 3 caracteres"),
  check("content")
    .not()
    .isEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 5 })
    .withMessage("La descripción debe tener al menos 5 caracteres"),
  check("date").not().isEmpty().withMessage("La fecha es obligatoria"),
  //middleware que maneja los errores
  fieldValidator,
];
