const bcrypt = require('bcrypt');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const { uploadImageToCloudinary } = require('../utils/imageUpload.js')
const cloudinary = require('cloudinary');
const { User } = require('../models/userModel.js');
const { mailSender } = require('../utils/emailSender.js');

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log("name, email, password, role", name, email, password, role);
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password should be at least 6 characters long' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let user = {
            name,
            email,
            password: hashedPassword,
            avatarPublicId: "default_public_id",
            avatarSecureUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            role: role
        };
        console.log("req.files", req.files);
        console.log("req.files.avatar, process.env.FOLDER", req.files.avatar, process.env.FOLDER);
        console.log("req.files", req.files);
        try {
            const result = await uploadImageToCloudinary(req.files.avatar, process.env.FOLDER, 250, 250, 'faces', 'fill');
            console.log("result of image->", result);
            user.avatarPublicId = result.public_id;
            user.avatarSecureUrl = result.secure_url;
        } catch (e) {
            console.log("error uploading file:", e);
            return res.status(400).json({
                message: 'File upload failed'
            });
        }
        user = await User.create(user)
        const jwtToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        user.password = undefined;
        res.cookie('jwtToken', jwtToken, {
            maxAge: 100 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
        });
        const mailResponse = await mailSender(email, "Registration Confirmation", "Thank you for registering!")
        console.log("mailResponse", mailResponse);
        return res.status(200).json({
            success: true,
            message: "User Registered",
            jwtToken,
            data: user,
        });
    } catch (error) {
        console.error('User Registration Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set JWT token in cookie
        res.cookie('jwtToken', jwtToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            jwtToken,
            data: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const logout = (req, res) => {
    try {
        res.cookie('jwtToken', null, {
            MaxAge: 0,
            httpOnly: true,
        }).status(200).json({
            success: true,
            message: 'we successfully logged Out'
        })
    }
    catch (error) {
        // console.log(error);
        return res.json({
            success: false,
            message: "We cant logged out",
            error: error.message
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                message: "plz provide all fields"
            })
        }
        console.log("name, email, password, role", name, email);

        const existingUser = await User.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name) existingUser.name = name;
        await cloudinary.v2.uploader.destroy(existingUser.avatarPublicId);
        try {
            const result = await uploadImageToCloudinary(req.files.avatar, process.env.FOLDER, 250, 250, 'faces', 'fill');
            console.log("result of image->", result);
            existingUser.avatarPublicId = result.public_id;
            existingUser.avatarSecureUrl = result.secure_url;
        } catch (e) {
            console.log("error uploading file:", e);
            return res.status(400).json({ message: 'File upload failed' });
        }
        await existingUser.save();
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: existingUser,
        });
    } catch (error) {
        console.error('User Update Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getInformation = async (req, res) => {
    try {
        const id = req.user.id
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.password = undefined;
        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('Get User Information Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const forget_password_token = async function (req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });
        console.log("user in forgor-password-token controller", user);
        if (!user) {
            return res.json({
                success: false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
            });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const forgetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        user.ForgetPasswordToken = forgetPasswordToken;
        user.ForgetPasswordTokenExpirement = Date.now() + 36 * 60 * 1000; // 36 minutes
        await user.save();
        console.log("user in forgor-password-token controller", user);

        const url = `http://localhost:3000/update-password/${token}`;

        const mailResponse = await mailSender(
            email,
            "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        res.json({
            success: true,
            message: "Email Sent Successfully, Please Check Your Email to Continue Further",
            url: url
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: `Some Error in Sending the Reset Message`,
            error: error.message,
        });
    }
}
const forget_password = async function (req, res) {
    try {
        const { resetToken, password } = req.body;
        console.log("resetToken, password", resetToken, password);
        const forgetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        console.log("forgotPasswordToken", forgetPasswordToken);
        const user = await User.findOne({
            where: {
                ForgetPasswordToken: forgetPasswordToken,
            }
        });
        console.log("user in forgot password controller", user);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid user not found"
            });
        }
        if (user.ForgetPasswordTokenExpirement < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token Expired"
            });
        }
        user.password = await bcrypt.hash(password, 10);
        user.ForgetPasswordToken = null;
        user.ForgetPasswordTokenExpirement = null;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
module.exports = { registerUser, loginUser, logout, updateUser, getInformation, forget_password_token, forget_password };
