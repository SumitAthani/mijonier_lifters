import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";

export const getDoctorsByHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { userId } = req.query;

        if (!hospitalId) {
            return res.status(400).json({
                success: false,
                message: "Hospital ID is required"
            });
        }


        const doctors = await Doctor.find({
            hospital: hospitalId,
            user: { $ne: userId }
        })
            .populate("user", "name email role")
            .populate("hospital", "name");

        return res.status(200).json({
            success: true,
            count: doctors.length,
            doctors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
