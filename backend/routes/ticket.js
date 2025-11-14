import express from "express";
import { createTicket, referTicketToAnotherDoctor, updateStatus } from "../controllers/ticket.js";
import { getTicketsByDoctor } from "../controllers/ticket.js";

const ticketRouter = express.Router();

ticketRouter.post("/", createTicket);
ticketRouter.get("/:doctorId", getTicketsByDoctor);
ticketRouter.patch("/:ticketId", referTicketToAnotherDoctor);
ticketRouter.put("/:ticketId", updateStatus);


export default ticketRouter;
