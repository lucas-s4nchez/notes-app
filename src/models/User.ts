import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  encryptPassword(password: string): string;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//método para encriptar la contraseña
UserSchema.methods.encryptPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

export default model<IUser>("User", UserSchema);
