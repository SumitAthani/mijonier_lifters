import express from "express";
import { createTicket } from "../controllers/ticket.js";
import { getTicketsByDoctor } from "../controllers/ticket.js";

const ticketRouter = express.Router();

ticketRouter.post("/", createTicket);
ticketRouter.get("/:doctorId", getTicketsByDoctor);


export default ticketRouter;
