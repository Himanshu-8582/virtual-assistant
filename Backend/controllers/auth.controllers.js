import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import genToken from "./token.js";

export const signUp = async (req, res) => {
    // console.log("📥 Incoming signup data:", req.body);
    try {
        const { name, email, password } = req.body;
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            // console.log("⚠️ Email already exists:", email);
            return res.status(400).json({ message: "Email already exists" });
        }
        if (password.length < 6) {
            // console.log("⚠️ Password too short:", password);
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            name,
            email,
            password: hashPassword,
        });

        const token = await genToken(user._id);    // Generate JWT token for the new user
        res.cookie("token", token, { 
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure:false                           // in production, set secure to true because we use https
        })                                         // we store the token in an HTTP-only cookie that expires in 7 days. so we can use this token to authenticate the user in subsequent requests.
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        // console.log("❌ Error during signup:", error);
        return res.status(500).json({ message: `signUp error: ${error}` });
    }
}



export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email does not exists" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = await genToken(user._id);    // Generate JWT token for the new user
        res.cookie("token", token, { 
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure:false                           // in production, set secure to true because we use https
        })                                         // we store the token in an HTTP-only cookie that expires in 7 days. so we can use this token to authenticate the user in subsequent requests.
        res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: `Login error: ${error}` });
    }
}

export const logOut = async (req, res) => {        // for logout we remove the token from the cookies
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: `logOut error: ${error}` });
    }
}