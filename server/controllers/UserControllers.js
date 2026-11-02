import generateToken from "../config/genToken.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .staus(400)
        .json({ success: false, message: "Fill all the fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password length must be greater than 6 characters.",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exist.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userId = user._id.toString();

    const token = generateToken(userId);

    return res.status(201).json({ success: true, token: token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error in registerUser controller",
        error: error.message,
      });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .sttaus(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const userId = user._id.toString();

    const token = generateToken(userId);

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error in loginUser controller",
        error: error.message,
      });
    }
};
