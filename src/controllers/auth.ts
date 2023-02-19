import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    //crear usuario con el modelo User
    const newUser: IUser = new User({
      username: username,
      email: email,
      password: password,
    });
    //encriptar la contraseña
    newUser.password = newUser.encryptPassword(newUser.password);
    //guardar en mongodb
    const savedUser = await newUser.save();
    //generar el token
    const token = jwt.sign(
      { uid: newUser._id, username: newUser.username },
      process.env.SECRET_JWT_SEED || "putoelquelee",
      {
        expiresIn: "2h",
      }
    );

    res.status(201).json({
      ok: true,
      uid: newUser._id,
      username: newUser.username,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    //Encontrar usuario
    const user = await User.findOne({ email: email });
    //Generar JWT
    const token = jwt.sign(
      { uid: user?._id, username: user?.username },
      process.env.SECRET_JWT_SEED || "putoelquelee",
      {
        expiresIn: "2h",
      }
    );

    res.json({
      ok: true,
      uid: user?.id,
      username: user?.username,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
export const revalidateToken = (req: Request, res: Response) => {
  const uid = req.uid;
  const username = req.username;

  //Generar un jwt
  const token = jwt.sign(
    { uid: uid, username: username },
    process.env.SECRET_JWT_SEED || "putoelquelee",
    {
      expiresIn: "2h",
    }
  );

  res.json({
    ok: true,
    uid,
    username,
    token: token,
  });
};
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const uid = req.uid;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese id",
      });
    }
    if (user._id.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No puedes eliminar un usuario que no creaste",
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({ ok: true, msg: `Usuario ${user.username} eliminado con éxito` });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error interno del servidor",
    });
  }
};
