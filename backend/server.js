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

// ─── GET /api/tests/leaderboard — fetch global leaderboard ──────────────────
app.get('/api/tests/leaderboard', protect, async (req, res) => {
    try {
        const results = await TestResult.find().populate('userId', 'name').lean();
        const userStats = {};
        
        results.forEach(r => {
            if (!r.userId || !r.userId.name || r.maxScore === 0) return;
            const uid = r.userId._id.toString();
            if (!userStats[uid]) {
                userStats[uid] = { name: r.userId.name, totalScore: 0, totalMax: 0, testsTaken: 0 };
            }
            userStats[uid].totalScore += r.finalScore;
            userStats[uid].totalMax += r.maxScore;
            userStats[uid].testsTaken += 1;
        });

        let rank = 1;
        const leaderboard = Object.values(userStats).map(u => ({
            name: u.name,
            testsTaken: u.testsTaken,
            scorePct: Math.round((u.totalScore / u.totalMax) * 100)
        })).sort((a, b) => {
            if (b.scorePct !== a.scorePct) return b.scorePct - a.scorePct;
            return b.testsTaken - a.testsTaken;
        }).map(u => ({ ...u, rank: rank++ }));

        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
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
