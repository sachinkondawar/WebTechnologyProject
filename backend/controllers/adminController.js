import Admin from '../models/Admin.js';
import TestResult from '../models/TestResult.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new admin
// @route   POST /api/admin/signup
export const signupAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if admin exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin
        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        });

        if (admin) {
            res.status(201).json({
                _id: admin.id,
                name: admin.name,
                email: admin.email,
                token: generateToken(admin._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        console.error('Admin Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate an admin
// @route   POST /api/admin/login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                _id: admin.id,
                name: admin.name,
                email: admin.email,
                token: generateToken(admin._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Admin Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users test results
// @route   GET /api/admin/results
// @access  Private (Admin)
export const getAllUsersResults = async (req, res) => {
    try {
        const results = await TestResult.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .lean();
        
        res.json(results);
    } catch (error) {
        console.error('Error fetching all user results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
