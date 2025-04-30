import { userModel } from "../../models/user.model.js";

const createUser = async ({ name, email, password }) => {
    if ([name, email, password].some((arg) => arg === undefined || arg === null || arg === "")) {
        throw new Error("Please provide all the details");
    }

    const existedUser = await userModel.findOne({ email });

    if (existedUser) {
        throw new Error("User already exists");
    }

    const user = await userModel.create({ name, email, password });

    const newUser = await userModel.findById(user._id).select("-password -refreshToken");

    if (!newUser) {
        throw new Error("User not created. Internal server error");
    }

    return newUser;
};

export default createUser;
