import { userModel } from "../../models/user.model.js";

const changePassword = async (userId, currentPassword, newPassword) => {
    try{
        const user = await userModel.findById(userId);
        const isMatch = await user.comparePassword(currentPassword);
        if(!isMatch){
            throw new Error("Invalid password");
        }
        user.password = newPassword;
        await user.save();
        return user; 
    }
    catch(err){
        throw new Error(`Error changing password: ` + err.message);
    }
}

export default changePassword;