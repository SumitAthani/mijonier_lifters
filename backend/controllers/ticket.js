import Ticket from "../models/ticket.model.js";

export const createTicket = async (req, res) => {
    try {
        const { title, status, messages } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        // if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "At least one userId is required"
        //     });
        // }

        const ticket = await Ticket.create({
            title,
            // userIds,
            messages: messages || [],
            status: status || "open",
        });

        return res.status(201).json({
            success: true,
            data: ticket,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};
