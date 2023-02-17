import { Request, Response } from "express";
import User, { IUser } from "../models/user";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const newUser: IUser = new User({
    username: username,
    email: email,
    password: password,
  });
  const savedUser = await newUser.save();
  console.log(savedUser);
  res.json(req.body);
};
export const loginUser = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json(req.body);
};
