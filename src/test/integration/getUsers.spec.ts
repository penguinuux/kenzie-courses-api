import { sign } from "jsonwebtoken";
import supertest from "supertest";
import { Connection } from "..";
import app from "../../app";
import { User } from "../../entities/User.entity";
import { userRepository } from "../../repositories";

describe("Get users route | Integration Test", () => {
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

  it("Return: Users list as JSON response | Status code: 200", async () => {
    const adminUser = new User();
    adminUser.firstName = "Admin";
    adminUser.lastName = "Admin";
    adminUser.email = "admin@testmail.com";
    adminUser.password = "test";
    adminUser.isAdm = true;
    adminUser.createdAt = new Date();
    adminUser.updatedAt = new Date();

    await userRepository.save(adminUser);

    const token = sign({ id: adminUser.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.EXPIRES_IN,
    });

    const response = await supertest(app)
      .get("/users")
      .send()
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("map");
  });

  it("Return: Missing authorization token | Status code: 400", async () => {
    const response = await supertest(app).get("/users").send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: You are not allowed to access this information | Status code: 401", async () => {
    const adminUser = new User();
    adminUser.firstName = "User";
    adminUser.lastName = "User";
    adminUser.email = "user@mail.com";
    adminUser.password = "test";
    adminUser.isAdm = false;
    adminUser.createdAt = new Date();
    adminUser.updatedAt = new Date();

    await userRepository.save(adminUser);

    const token = sign({ id: adminUser.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.EXPIRES_IN,
    });

    const response = await supertest(app)
      .get("/users")
      .send()
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "You are not allowed to access this information",
    });
  });
});
