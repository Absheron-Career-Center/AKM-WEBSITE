const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

class AdminController {
    adminLogin = async (req, res) => {
        try {
            const { email, password } = req.body;

            // 1. Check against hardcoded admin credentials
            if (this.isHardcodedAdmin(email, password)) {
                const adminUser = await this.upsertHardcodedAdmin(email, password);
                return this.sendAuthResponse(res, adminUser);
            }

            // 2. Check database for admin users
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Verify password
            if (!(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Skip verification for admins, require for regular users
            if (!this.isAdmin(user) && !user.isVerified) {
                return res.status(403).json({ message: 'Please verify your email first' });
            }

            return this.sendAuthResponse(res, user);

        } catch (error) {
            console.error('Admin login error:', error);
            res.status(500).json({ message: 'Login failed', error: error.message });
        }
    }
    getAllUsers = async (req, res) => {
        try {
            if (!this.isAdmin(req.user)) {
                return res.status(403).json({ message: "Unauthorized access" });
            }

            const users = await User.find().select('-password');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({
                message: "Error retrieving users",
                error: error.message
            });
        }
    }

    getAllUserSubmissions = async (req, res) => {
        try {
            if (!this.isAdmin(req.user)) {
                return res.status(403).json({ message: "Unauthorized access" });
            }

            const users = await User.find().select('name phoneNumber address email jobName');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({
                message: "Error retrieving user submissions",
                error: error.message
            });
        }
    }

    promoteToAdmin = async (req, res) => {
        try {
            if (req.user.role !== 'master-admin') {
                return res.status(403).json({ message: "Requires master-admin privileges" });
            }

            const { userId } = req.params;
            const user = await User.findByIdAndUpdate(
                userId,
                { role: 'admin' },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                message: "User promoted to admin successfully",
                user
            });
        } catch (error) {
            res.status(500).json({
                message: "Error promoting user",
                error: error.message
            });
        }
    }

    deleteUserSubmission = async (req, res) => {
        try {
            if (!this.isAdmin(req.user)) {
                return res.status(403).json({ message: "Unauthorized access" });
            }

            const { submissionId } = req.params;
            const deletedUser = await User.findByIdAndDelete(submissionId);

            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                message: "User deleted successfully",
                userId: submissionId
            });
        } catch (error) {
            res.status(500).json({
                message: "Error deleting user",
                error: error.message
            });
        }
    }
    
    isHardcodedAdmin = (email, password) => {
        return email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
    }

    upsertHardcodedAdmin = async (email, password) => {
        const updateData = {
            email,
            password: await bcrypt.hash(password, 10),
            role: 'admin',
            isVerified: true,
            updatedAt: new Date()
        };

        return await User.findOneAndUpdate(
            { email },
            {
                $set: updateData,
                $setOnInsert: {
                    createdAt: new Date()
                }
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );
    }

    isAdmin = (user) => {
        return user && ['admin', 'master-admin'].includes(user.role);
    }

    sendAuthResponse = (res, user) => {
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                isVerified: this.isAdmin(user) ? true : user.isVerified,
                generatedAt: new Date().toISOString() // Add timestamp
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        console.log('Generated new token:', token); // Debug log

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                isVerified: this.isAdmin(user) ? true : user.isVerified
            }
        });
    }
}

module.exports = new AdminController();