import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/database.js";
import ticketRouter from "./routes/ticket.js";
import loginRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000;

connect();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());

app.use("/api/tickets", ticketRouter);
app.use("/api/auth", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/doctors", doctorRouter);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});