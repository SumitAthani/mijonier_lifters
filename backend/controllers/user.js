import User from "../models/user.model.js";

export const getAllNormalUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: { $nin: ["admin", "doctor"] }
        });


        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
