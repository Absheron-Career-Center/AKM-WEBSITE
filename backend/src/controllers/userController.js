const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendVerificationEmail } = require('../services/emailService');
require('dotenv').config();

const pendingSignups = {};

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

class UserController {
  async signup(req, res) {
    try {
      const { name, phoneNumber, address, jobName, email, password } = req.body;

      // Validate all required fields
      if (!name || !phoneNumber || !address || !jobName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required.',
          requiredFields: ['name', 'phoneNumber', 'address', 'jobName', 'email', 'password']
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists.'
        });
      }

      // Generate and store verification code
      const verificationCode = generateVerificationCode();
      pendingSignups[email] = {
        userData: { name, phoneNumber, address, jobName, email, password },
        code: verificationCode,
        createdAt: Date.now()
      };

      // Send verification email
      try {
        await sendVerificationEmail(email, verificationCode);
        return res.status(200).json({
          success: true,
          message: `Verification code sent to ${email}`,
          nextStep: '/verify'
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        delete pendingSignups[email]; // Clean up if email fails
        return res.status(500).json({
          success: false,
          message: 'Failed to send verification email'
        });
      }

    } catch (error) {
      console.error('Signup error:', error);
      return res.status(500).json({
        success: false,
        message: 'Signup process failed',
        error: error.message
      });
    }
  }

  async verify(req, res) {
    try {
      console.log('Verification request body:', req.body);

      const { email, verificationCode } = req.body;

      // Validate input
      if (!email || !verificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Email and verification code are required.',
          received: req.body
        });
      }

      // Check if verification is pending
      const pending = pendingSignups[email];
      if (!pending) {
        return res.status(400).json({
          success: false,
          message: 'No verification pending for this email. Please sign up again.',
          availableEmails: Object.keys(pendingSignups)
        });
      }

      // Check code expiration (30 minutes)
      if (Date.now() - pending.createdAt > 30 * 60 * 1000) {
        delete pendingSignups[email];
        return res.status(400).json({
          success: false,
          message: 'Verification code has expired. Please sign up again.'
        });
      }

      // Verify code
      if (pending.code !== verificationCode) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code.'
        });
      }

      // Create user account
      const hashedPassword = await bcrypt.hash(pending.userData.password, 10);

      const newUser = new User({
        ...pending.userData,
        password: hashedPassword,
        verified: true,
        role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user'
      });

      await newUser.save();
      delete pendingSignups[email]; // Clean up

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });

    } catch (error) {
      console.error('Verification error:', error);
      return res.status(500).json({
        success: false,
        message: 'Account verification failed',
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.'
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials.'
        });
      }

      if (!user.verified) {
        return res.status(403).json({
          success: false,
          message: 'Please verify your email first.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials.'
        });
      }

      // Fixed JWT signing - using JWT_SECRET from .env
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET, // Using the correct env variable
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          address: user.address,
          jobName: user.jobName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get current user',
        error: error.message
      });
    }
  }
  getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only allow users to access their own data or admins
      if (req.user.id !== user._id.toString() && !this.isAdmin(req.user)) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving user",
        error: error.message
      });
    }
  }

  updateUser = async (req, res) => {
    try {
      const { id } = req.params;

      // Only allow users to update their own data or admins
      if (req.user.userId !== id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          address: updatedUser.address,
          jobName: updatedUser.jobName,
          role: updatedUser.role
        }
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating user",
        error: error.message
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      return res.status(200).json({
        success: true,
        user
      });

    } catch (error) {
      console.error('Profile error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: error.message
      });
    }
  }

  async resendVerificationCode(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required.'
        });
      }

      // Check if there's a pending verification
      const pending = pendingSignups[email];
      if (!pending) {
        return res.status(400).json({
          success: false,
          message: 'No pending verification for this email.'
        });
      }

      // Generate new code
      const newCode = generateVerificationCode();
      pendingSignups[email].code = newCode;
      pendingSignups[email].createdAt = Date.now();

      // Resend email
      await sendVerificationEmail(email, newCode);

      return res.status(200).json({
        success: true,
        message: `New verification code sent to ${email}`
      });

    } catch (error) {
      console.error('Resend code error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to resend verification code',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();