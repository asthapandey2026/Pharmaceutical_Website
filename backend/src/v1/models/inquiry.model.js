import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    query: {
        type: [String], // Changed to array of strings
        required: true,
        default: []
    },
    response: {
        type: [String], // Changed to array of strings
        default: []
    },
    status: {
        type: String,
        enum: ['pending', 'answered'],
        default: 'pending'
    },
    answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
    
}, { timestamps: true });

querySchema.index({ userID: 1, status: 1 });

export default mongoose.model('Queries', querySchema);
