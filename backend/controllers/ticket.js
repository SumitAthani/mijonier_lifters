import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";

export const createTicket = async (req, res) => {
    try {
        const { title, status, messages, userIds, patient } = req.body;

        // Validate Title
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        // Validate Patient
        if (!patient) {
            return res.status(400).json({
                success: false,
                message: "Patient ID is required"
            });
        }

        const patientUser = await User.findById(patient);

        if (!patientUser || patientUser.role !== "user") {
            return res.status(400).json({
                success: false,
                message: "Invalid patient ID. Only users with role 'user' can be patients."
            });
        }

        // Validate doctor userIds
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one doctor userId is required"
            });
        }

        const doctors = await User.find({ _id: { $in: userIds }, role: "doctor" });

        if (doctors.length !== userIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more userIds are invalid or not doctors"
            });
        }

        // Create Ticket
        const ticket = await Ticket.create({
            title,
            patient,
            userIds,
            messages: messages || [],
            status: status || "open",
        });

        return res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            data: ticket,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";

export const getTicketsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Validate doctor
        const doctor = await User.findById(doctorId);

        if (!doctor || doctor.role !== "doctor") {
            return res.status(400).json({
                success: false,
                message: "Invalid doctor ID"
            });
        }

        // Find tickets where doctor is assigned
        const tickets = await Ticket.find({ userIds: doctorId })
            .populate("patient", "name email")
            .populate("userIds", "name email role")
            .populate("messages.sentBy", "name email");

        return res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
