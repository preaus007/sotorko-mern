import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export async function handleUserSignUp(req, res) {
  const { name, email, phone, password } = req.body;

  try {
    if (!name || !email || !phone || !password) {
      throw new Error("All fields are required");
    }

    // Check if user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      console.log("User already exists : ", userAlreadyExists);
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    // await sendVerificationEmail(user.email, verificationToken);
    await sendVerificationEmail("touhedcs@gmail.com", verificationToken);

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
}

export async function verifyEmail(req, res) {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function handleUserLogIn(req, res) {
  const { email, password } = req.body;
  const errorMessage = "Invalid email or password";
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: errorMessage, success: false });
    }
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: errorMessage, success: false });
    }

    // Generate token
    const token = generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (e) {
    console.log("Error in login ", e);
    res.status(400).json({ success: false, message: e.message });
  }
}

export async function handleUserLogOut(req, res) {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    // console.log(resetToken);

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.BASE_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function checkAuth(req, res) {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
}
