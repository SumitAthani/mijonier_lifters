import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/database.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000;

connect();

app.use(express.json());


app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});