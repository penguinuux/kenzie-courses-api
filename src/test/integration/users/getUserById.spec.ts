import { sign } from "jsonwebtoken";
import supertest from "supertest";
import { Connection } from "../../";
import app from "../../../app";
import { User } from "../../../entities/User.entity";
import { userRepository } from "../../../repositories";

describe("Get users by id route | Integration Test", () => {
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

  it("Return: User searched by id as JSON response when logged as admin | Status code: 200", async () => {
    const adminUser = new User();
    adminUser.firstName = "Admin";
    adminUser.lastName = "Admin";
    adminUser.email = "admin@testmail.com";
    adminUser.password = "test";
    adminUser.isAdm = true;
    adminUser.createdAt = new Date();
    adminUser.updatedAt = new Date();

    const user = new User();
    user.firstName = "Name";
    user.lastName = "LastName";
    user.email = "user@mail.com";
    user.password = "test";
    user.isAdm = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await userRepository.save(adminUser);
    await userRepository.save(user);

    const token = sign({ id: adminUser.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.EXPIRES_IN,
    });

    const response = await supertest(app)
      .get(`/users/${user.id}`)
      .send()
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toStrictEqual(user.id);
  });

  it("Return: Missing authorization token | Status code: 400", async () => {
    const user = new User();
    user.firstName = "Name";
    user.lastName = "LastName";
    user.email = "user@mail.com";
    user.password = "test";
    user.isAdm = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await userRepository.save(user);

    const token = sign({ id: user.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.EXPIRES_IN,
    });
    const response = await supertest(app).get(`/users/${user.id}`).send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: You can't access information of another user | Status code: 403", async () => {
    const adminUser = new User();
    adminUser.firstName = "Admin";
    adminUser.lastName = "Admin";
    adminUser.email = "admin@testmail.com";
    adminUser.password = "test";
    adminUser.isAdm = true;
    adminUser.createdAt = new Date();
    adminUser.updatedAt = new Date();

    const user = new User();
    user.firstName = "Name";
    user.lastName = "LastName";
    user.email = "user@mail.com";
    user.password = "test";
    user.isAdm = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await userRepository.save(adminUser);
    await userRepository.save(user);

    const token = sign({ id: user.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.EXPIRES_IN,
    });

    const response = await supertest(app)
      .get(`/users/${adminUser.id}`)
      .send()
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "You can't access information of another user",
    });
  });
});
