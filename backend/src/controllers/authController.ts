import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const createToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });

    if (exists) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashed }) as typeof User.prototype & { _id: any };
    
    const token = createToken(user._id.toString());
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })as typeof User.prototype & { _id: string };;

    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = createToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ id: user._id, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
};
