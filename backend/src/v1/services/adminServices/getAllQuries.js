import inquiryModel from "../../models/inquiry.model.js";

const getAllQuries = async () => {
    try {
        const inquiries = await inquiryModel.find({status: "pending"}).populate("userID", "name email");
        return inquiries;  
    } catch (error) {
        throw new Error(`error from fnc: ${error}`);
    }
}
    
export default getAllQuries;