import { userModel } from "../../models/user.model.js";

const accessAndRefreshToken = async (userId) => {
    try {
       const user = await userModel.findById(userId)
       
        const accessToken = await user.generateAccessToken();
        // console.log(accessToken);
        const refreshToken = await user.generateRefreshToken();
        // console.log(refreshToken);

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        return { accessToken, refreshToken };

    } catch (error) {
        throw new Error(`error in generating token ${error}`);
    }
}

const loginUser = async ({ email, password }) => {
    // console.log(email, password);
    
    if ([email, password].some((arg) => arg === undefined || arg === null || arg === "")) {
        throw new Error("Please provide all the details");
    }

    // console.log(email, password);


    const user = await userModel.findOne({ email }).select("+password");

// console.log(user);


    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    
    const { accessToken, refreshToken } = await accessAndRefreshToken(user._id);
    const loogedInUser = await userModel.findById(user._id).select("-password -refreshToken");
    

    return { accessToken, refreshToken , loogedInUser };
}

export default loginUser;