import inquiryModel from "../../models/inquiry.model.js";

const deleteInquiry = async (id) => {
    try {
        // Validate input
        if (!id) {
            throw new Error("Inquiry ID is required");
        }

        // Find and update the inquiry
        const inquiry = await inquiryModel.findByIdAndUpdate(
            id,                  // First argument: id
            {                    // Second argument: update object
                query: [],
                response: [], 
                status: 'answered',
                answeredBy: null
            },
            {                    // Third argument: options
                new: true,
                runValidators: true
            }
        );

        // Check if inquiry exists
        if (!inquiry) {
            throw new Error("Inquiry not found");
        }

        return inquiry;
    } catch (error) {
        throw new Error(`Failed to clear conversation: ${error.message}`);
    }
};

export default deleteInquiry;