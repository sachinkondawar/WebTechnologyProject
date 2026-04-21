import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { testDatabase } from './data/testDatabase.js';
import TestResult from './models/TestResult.js';
import protect from './middleware/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Auth Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── GET /api/tests — static test catalogue ─────────────────────────────────
app.get('/api/tests', (req, res) => {
    res.json(testDatabase);
});

// ─── GET /api/tests/results — fetch results for logged-in user ────────────
app.get('/api/tests/results', protect, async (req, res) => {
    try {
        const results = await TestResult.find({ userId: req.user._id })
            .sort({ createdAt: -1 })   // newest first
            .lean();
        res.json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ─── POST /api/tests/results — save a new result for logged-in user ─────────
app.post('/api/tests/results', protect, async (req, res) => {
    try {
        const { testId, finalScore, maxScore, answers } = req.body;

        if (!testId) {
            return res.status(400).json({ error: 'Missing testId' });
        }

        const result = await TestResult.create({
            userId: req.user._id,
            testId,
            finalScore,
            maxScore,
            answers,
        });

        res.status(201).json({ message: 'Result saved successfully', resultId: result._id });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Accessible on local network at http://192.168.29.44:${PORT}`);
});
