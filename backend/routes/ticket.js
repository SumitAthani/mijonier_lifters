import express from "express";

import { createTicket } from "../controllers/ticket.js";

const ticketRouter = express.Router();

ticketRouter.post("/", createTicket);


export default ticketRouter;
