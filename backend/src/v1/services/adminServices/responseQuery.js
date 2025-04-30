import inquiryModel from "../../models/inquiry.model.js";

const answerQuery = async (id, response, queryIndex, adminId) => {
    try {
        // Validate inputs
        if (!id || !response || queryIndex === undefined || !adminId) {
            throw new Error("Missing required parameters");
        }

        // Find and validate inquiry exists
        const inquiry = await inquiryModel.findById(id);
        if (!inquiry) {
            throw new Error("Query not found");
        }

        // Validate query index
        if (queryIndex < 0 || queryIndex >= inquiry.query.length) {
            throw new Error("Invalid query index");
        }

        // Update response at specific index
        inquiry.response[queryIndex] = response;

        // Check if all queries have responses
        const allAnswered = inquiry.response.every(r => r !== null && r !== undefined);
        
        // Update status only if all queries are answered
        if (allAnswered) {
            inquiry.status = 'answered';
            inquiry.answeredBy = adminId;
        }

        // Save and return updated document
        const updatedInquiry = await inquiry.save();
        
        if (!updatedInquiry) {
            throw new Error("Failed to save response");
        }

        return updatedInquiry;
    } catch (error) {
        // Add specific error types for better frontend handling
        const errorMessage = error.message || 'Error updating response';
        throw new Error(`Error updating response: ${errorMessage}`);
    }
};

export default answerQuery;
