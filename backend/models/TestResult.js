import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    testId: {
        type: String,
        required: true,
    },
    finalScore: {
        type: Number,
        required: true,
    },
    maxScore: {
        type: Number,
        required: true,
    },
    answers: {
        type: Object,
        default: {},
    },
}, {
    timestamps: true,  // gives us createdAt + updatedAt automatically
});

const TestResult = mongoose.model('TestResult', testResultSchema);
export default TestResult;
