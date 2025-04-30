import queryModel from "../../models/inquiry.model.js"

const getAllQurries = async (id) => {
    try {
        if (!id) {
            throw new Error("Please provide all details");
        }
        console.log(`id: ${id}`);
        
        const queries = await queryModel.find({ userID: id })
        return queries;
    } catch (error) {
        throw new Error(`error from fnc: ${error}`);
    }
}

export default getAllQurries;