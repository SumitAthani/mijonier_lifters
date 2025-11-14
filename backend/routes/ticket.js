import express from "express";
import { createTicket, referTicketToAnotherDoctor } from "../controllers/ticket.js";
import { getTicketsByDoctor } from "../controllers/ticket.js";

const ticketRouter = express.Router();

ticketRouter.post("/", createTicket);
ticketRouter.get("/:doctorId", getTicketsByDoctor);
ticketRouter.patch("/:ticketId", referTicketToAnotherDoctor);


export default ticketRouter;
