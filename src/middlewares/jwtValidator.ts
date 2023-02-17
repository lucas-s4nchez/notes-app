import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface IPayload {
  uid: string;
  username: string;
  iat: number;
  exp: number;
}

const jwtValidator = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid, username } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED || "putoelquelee"
    ) as IPayload;
    req.uid = uid;
    req.username = username;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }

  next();
};

export default jwtValidator;
