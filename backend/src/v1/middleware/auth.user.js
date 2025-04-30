import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => { 
    // console.log(req.cookies.accessToken);
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: "Unauthorized access - No token provided"
        });
    }

    try {
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await userModel.findById(decoded._id).select("-password -refreshToken");
        
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: "Unauthorized access - Invalid user"
            });
        }
        // console.log(`User ${user.role} authenticated`);
        
        req.user = user;
        
        return next();
    }
    catch (error) {
        return res.status(401).json({
            status: 'error',
            message: `Unauthorized access - ${error.message}`
        });
    }
}

export default authUser;