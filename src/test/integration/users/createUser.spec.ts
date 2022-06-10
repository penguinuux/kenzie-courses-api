import supertest from "supertest";
import { Connection, generateUser } from "../..";
import app from "../../../app";
import { User } from "../../../entities/User.entity";

describe("Create user route | Integration Test", () => {
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

  it("Return: User as JSON response | Status code: 201", async () => {
    const user: Partial<User> = generateUser();

    const response = await supertest(app)
      .post("/users")
      .send({ ...user });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
  });

  it("Return: firstName is a required field | Status code: 400", async () => {
    const user: Partial<User> = generateUser();
    const { firstName, ...invalidUser } = user;

    const response = await supertest(app)
      .post("/users")
      .send({ ...invalidUser });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toHaveLength(1);
  });
});
