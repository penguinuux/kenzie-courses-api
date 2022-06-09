import supertest from "supertest";
import { Connection, generateCourse } from "../..";
import app from "../../../app";
import { User } from "../../../entities";
import { Course } from "../../../entities/Course.entity";
import { userRepository } from "../../../repositories";
import { sign } from "jsonwebtoken";

describe("Create course route | Integration Test", () => {
  const dbConnection = new Connection();

  beforeAll(async () => {
    await dbConnection.create();
  });

  afterAll(async () => {
    await dbConnection.clear();
    await dbConnection.close();
  });

  beforeEach(async () => {
    await dbConnection.clear();
  });

  it("Return: Course as JSON response | Status code: 201", async () => {
    const course: Partial<Course> = generateCourse();

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
      .post("/courses")
      .send({
        ...course,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("courseName");
    expect(response.body).toHaveProperty("duration");
  });

  it("Return: Body error, missing authorization token | Status code: 400", async () => {
    const course: Partial<Course> = generateCourse();

    const response = await supertest(app)
      .post("/courses")
      .send({ ...course });

    expect(response.status).toBe(400);
  });
});
