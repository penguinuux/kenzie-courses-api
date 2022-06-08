import supertest from "supertest";
import { Connection, generateCourse } from "..";
import app from "../../app";
import { Course } from "../../entities/Course.entity";

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

    await supertest(app).post("/users").send({
      firstName: "Admin",
      lastName: "Admin",
      email: "admin@testmail.com",
      password: "test",
      isAdm: true,
    });

    const login = await supertest(app)
      .post("/login")
      .send({ email: "admin@testmail.com", password: "test" });

    const response = await supertest(app)
      .post("/courses")
      .send({
        ...course,
      })
      .set("Authorization", `Bearer ${login.body.token}`);

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
