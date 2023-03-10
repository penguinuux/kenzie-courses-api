import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify, VerifyErrors } from "jsonwebtoken";
import { User } from "../entities";
import { ErrorHandler } from "../errors/errors";

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Missing authorization token." });
  }

  return verify(
    token,
    process.env.SECRET_KEY,
    (err: VerifyErrors, decoded: string | JwtPayload) => {
      if (err) {
        throw new ErrorHandler(401, err.message);
      }

      req.decoded = decoded as Partial<User>;

      return next();
    }
  );
};

export default validateToken;
