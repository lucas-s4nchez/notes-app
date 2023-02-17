import express, { Application } from "express";
import morgan from "morgan";
import dbConnection from "./database/config";
import authRoutes from "./routes/auth";

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

export default app;
