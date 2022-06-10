import { hashSync } from "bcrypt";
import supertest from "supertest";
import { Connection } from "../..";
import app from "../../../app";
import { User } from "../../../entities/User.entity";
import { userRepository } from "../../../repositories";

describe("User login route | Integration Test", () => {
  const dbConnection = new Connection();

  beforeAll(async () => {
    dbConnection.create();
  });

  afterAll(async () => {
    await dbConnection.clear();
    await dbConnection.close();
  });

  beforeEach(async () => {
    await dbConnection.clear();
  });

  it("Return: Token as JSON response | Status code: 200", async () => {
    const user = new User();
    user.firstName = "Name";
    user.lastName = "LastName";
    user.email = "name@mail.com";
    user.password = hashSync("test", 8);
    user.isAdm = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await userRepository.save(user);

    const response = await supertest(app)
      .post("/login")
      .send({ email: user.email, password: "test" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Return: body error, Invalid credentials | Status code: 401", async () => {
    const user = new User();
    user.firstName = "Name";
    user.lastName = "LastName";
    user.email = "name@mail.com";
    user.password = hashSync("test", 8);
    user.isAdm = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await userRepository.save(user);

    const response = await supertest(app)
      .post("/login")
      .send({ email: user.email, password: "wrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({ message: "Invalid credentials" });
  });
});
