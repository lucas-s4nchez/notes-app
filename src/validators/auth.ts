import { check } from "express-validator";
import fieldValidator from "../middlewares/fieldValidator";
import User from "../models/User";
import bcrypt from "bcrypt";

export const validateRegister = [
  check("username").not().isEmpty().withMessage("El nombre es obligatorio"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Email no válido")
    .custom(async (value: string) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject();
      }
    })
    .withMessage("Email ya se encuentra registrado"),

  check("password")
    .not()
    .isEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  //middleware que maneja los errores
  fieldValidator,
];

export const validateLogin = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Email no válido")
    .custom(async (value: string) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        return Promise.reject();
      }
    })
    .withMessage("No existe un usuario con este email"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .custom(async (value: string, { req }) => {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const validPassword = bcrypt.compareSync(value, user.password);
        if (!validPassword) {
          return Promise.reject();
        }
      }
    })
    .withMessage("La contraseña es incorrecta"),
  //middleware que maneja los errores
  fieldValidator,
];
