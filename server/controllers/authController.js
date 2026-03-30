const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields must be filled" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const candidate = await User.findOne({ email });
        if (candidate) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationLink = uuid.v4();

        const user = new User({
            email,
            password: hashedPassword,
            activationLink
        });
        await user.save();

        const activationUrl = `${process.env.CLIENT_URL}/activate/${activationLink}`;

        await transporter.sendMail({
            from: 'admin@resource-center.com',
            to: email,
            subject: 'Account activation at Gym Resource Centre',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h1>Welcome to Gym Resource Centre!</h1>
                    <p>To complete your registration, please follow the link below:</p>
                    <a href="${activationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Confirm Registration</a>
                </div>
            `
        });

        return res.status(201).json({ message: "Activation email has been sent" });
    } catch (e) {
        res.status(500).json({ message: e.message || "Registration error" });
    }
};

const activate = async (req, res) => {
    try {
        const activationLink = req.params.link;
        const user = await User.findOne({ activationLink });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired activation link" });
        }

        user.isActivated = true;
        user.activationLink = null;
        await user.save();

        return res.status(200).json({
            message: "Account successfully activated!",
            email: user.email
        });
    } catch (e) {
        res.status(500).json({ message: "Activation error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with this email not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        if (!user.isActivated) {
            return res.status(400).json({ message: "Please confirm your email first" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            user: { id: user._id, email: user.email, role: user.role }
        });

    } catch (e) {
        res.status(500).json({ message: "Server error during login" });
    }
};

module.exports = { register, activate, login };