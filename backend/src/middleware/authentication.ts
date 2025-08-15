import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id?: string;
    };

    if (!decoded?.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: invalid token" });
    }
    req.user = { id: decoded.id };
    return next();
  } catch {
    return res.status(403).json({ message: "Forbidden" });
  }
};
