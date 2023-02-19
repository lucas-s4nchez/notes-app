import express, { Application } from "express";
import morgan from "morgan";
import dbConnection from "./database/config";
import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";

const app: Application = express(); //tipo de dato: Aplication

//data base
dbConnection();
//settings
app.set("port", process.env.PORT);

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

export default app;
