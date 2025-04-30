import queryModel from "../../models/inquiry.model.js";

const makeQuerry = async (userID, query, email) => {
    try {
        if (typeof query !== 'string' || !query.trim()) {
            throw new Error('Query must be a non-empty string');
        }
        let userInquiry = await queryModel.findOne({ userID });

        if (userInquiry) {
            userInquiry.query = [...userInquiry.query, query];
            userInquiry.response = [...userInquiry.response, null];
            userInquiry.status = 'pending';
            await userInquiry.save();
            return userInquiry;
        }
        userInquiry = await queryModel.create({
            userID,
            query: [query],      // Initialize array with first query string
            response: [null],    // Initialize array with null response
            email,
            status: 'pending'
        });

        return userInquiry;
    } catch (error) {
        throw new Error(`Error managing queries: ${error.message}`);
    }
}

export default makeQuerry;