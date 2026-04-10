import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

// Connect to MongoDB
connectDB();
// We import the static DB from our local data folder
import { testDatabase } from './data/testDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const resultsFilePath = path.join(__dirname, 'data', 'results.json');

// Ensure results file exists
if (!fs.existsSync(resultsFilePath)) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
    fs.writeFileSync(resultsFilePath, JSON.stringify([]));
}

// Routes
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);

// GET /api/tests - Returns the cognitive tests
app.get('/api/tests', (req, res) => {
    res.json(testDatabase);
});

// POST /api/tests/results - Save a test result
app.post('/api/tests/results', (req, res) => {
    try {
        const { testId, finalScore, maxScore, answers } = req.body;
        
        if (!testId) {
            return res.status(400).json({ error: 'Missing testId' });
        }

        const newResult = {
            id: Date.now().toString(),
            testId,
            finalScore,
            maxScore,
            answers,
            timestamp: new Date().toISOString()
        };

        // Read existing, append, rewrite
        const currentData = JSON.parse(fs.readFileSync(resultsFilePath, 'utf8'));
        currentData.push(newResult);
        fs.writeFileSync(resultsFilePath, JSON.stringify(currentData, null, 2));

        res.status(201).json({ message: 'Result saved successfully', resultId: newResult.id });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
