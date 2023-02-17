import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DB_CNN || "mongodb://localhost:27017");
    console.log("base de datos conectada");
  } catch (error) {
    console.log(error);
    throw new Error("Error al concetar la base de datos");
  }
};

export default dbConnection;
