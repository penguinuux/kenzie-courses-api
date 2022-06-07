import validateToken from "../../middlewares/validateToken.middleware";
import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../../errors/errors";
import { sign } from "jsonwebtoken";

config();

describe("validateToken Middleware Tests", () => {
  const mockReq: Partial<Request> = {};
  const mockRes: Partial<Response> = {
    status: jest.fn(),
    json: jest.fn(),
  };

  const nextFunction: NextFunction = jest.fn();

  it("Error: Missing authorization token. | Status code: 400", async () => {
    mockReq.headers = {};

    const validateResponse = await validateToken(
      mockReq as Request,
      mockRes as Response,
      nextFunction
    );

    expect(validateResponse).toHaveProperty("status");
  });

  it("Error: jwt malformed. | Status code: 401", async () => {
    mockReq.headers = {
      authorization: "Token auishfi9uh",
    };

    try {
      await validateToken(
        mockReq as Request,
        mockRes as Response,
        nextFunction
      );
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorHandler);
      expect(error.message).toBe("jwt malformed");
      expect(error.statusCode).toBe(401);
    }
  });

  it("Will call next function and add 'decoded' key on mockReq object.", async () => {
    const emailTest = "email.test@test.com";
    const token = sign(emailTest, process.env.SECRET_KEY);

    mockReq.headers = {
      authorization: `Token ${token}`,
    };

    await validateToken(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toBeCalled();
    expect(nextFunction).toBeCalledTimes(1);

    expect(mockReq).toHaveProperty("decoded");
    expect(mockReq.decoded).toStrictEqual(emailTest);
  });
});
