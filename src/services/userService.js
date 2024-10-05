import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/mailer.js";

class UserService {
  async createUser(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("Email already exists");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const emailToken = crypto.randomBytes(32).toString("hex");

      const user = new User({
        ...userData,
        password: hashedPassword,
        emailToken: emailToken,
        isVerified: false,
      });

      await user.save();

      sendVerificationEmail(user, emailToken);

      const {
        password,
        emailToken: token,
        ...userWithoutPassword
      } = user.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async loginUser({ email, password }) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      if (!user.isVerified) {
        throw new Error("Please verify your email to login");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const { password: userPassword, ...userWithoutPassword } =
        user.toObject();
      return { token, user: userWithoutPassword };
    } catch (error) {
      throw new Error(`Error logging in: ${error.message}`);
    }
  }

  async verifyEmail(token) {
    try {
      const user = await User.findOne({ emailToken: token });
      if (!user) {
        throw new Error("Invalid or expired token");
      }

      user.isVerified = true;
      user.emailToken = null;
      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Error verifying email: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async updateUser(userId, updateData) {
    try {
      const { password, ...dataWithoutPassword } = updateData;

      const user = await User.findByIdAndUpdate(userId, dataWithoutPassword, {
        new: true,
      }).select("-password");

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
}

export default new UserService();
