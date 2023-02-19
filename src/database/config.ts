import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const { DB_CNN, DB_CNN_TEST, NODE_ENV } = process.env;

const stringConection = NODE_ENV === "test" ? DB_CNN_TEST : DB_CNN;

const dbConnection = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(stringConection!)
      .then(() => {
        console.log("Database connected");
      })
      .catch((err) => {
        console.error(err);
      });
    console.log("base de datos conectada");
  } catch (error) {
    console.log(error);
    throw new Error("Error al concetar la base de datos");
  }
};

export default dbConnection;
