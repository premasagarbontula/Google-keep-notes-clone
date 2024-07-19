import userModel from "../models/userModel.js";
import { comparePasswords, hashPassword } from "./../helpers/authHelper.js";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name) {
      return res.send({ error: "Name is required" });
    }
    if (!email) {
      return res.send({ error: "Email is required" });
    }
    if (!password) {
      return res.send({ error: "Password is required" });
    }
    if (!phone) {
      return res.send({ error: "Phone Number is required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Email already exists. Please Login",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
    }).save();
    res.status(200).send({
      success: true,
      message: "Registered Successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Please provide valid credentials",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not exists. Please Register",
      });
    }
    const verify = await comparePasswords(password, user.password);
    if (!verify) {
      res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWTKEY, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Log in Successfull",
      jwtToken,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
