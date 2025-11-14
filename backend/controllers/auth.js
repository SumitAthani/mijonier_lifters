import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Hospital from "../models/hospital.model.js";

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Compare password (not hashed)
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        let doctorDetails = null;
        let hospitalDetails = null;

        // ⭐ If user is DOCTOR → fetch doctor + hospital
        if (user.role === "doctor") {
            doctorDetails = await Doctor.findOne({ user: user._id });

            if (doctorDetails) {
                hospitalDetails = await Hospital.findById(doctorDetails.hospital);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                hospital: hospitalDetails?._id
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
