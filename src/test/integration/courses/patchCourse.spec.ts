import supertest from "supertest";
import { Connection } from "../..";
import app from "../../../app";
import { Course } from "../../../entities/Course.entity";
import { courseRepository, userRepository } from "../../../repositories";
import { sign } from "jsonwebtoken";
import { User } from "../../../entities";

describe("Patch course route | Integration Test", () => {
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

  it("Return: Patched course as JSON response | Status code: 200", async () => {
    const course = new Course();
    course.courseName = "name";
    course.duration = "duration";

    const adminUser = new User();
    adminUser.firstName = "Name";
    adminUser.lastName = "LastName";
    adminUser.email = "name@mail.com";
    adminUser.password = "test";
    adminUser.isAdm = true;
    adminUser.createdAt = new Date();
    adminUser.updatedAt = new Date();

    await userRepository.save(adminUser);
    await courseRepository.save(course);

    const token = sign({ id: adminUser.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.EXPIRES_IN,
    });

    const response = await supertest(app)
      .patch(`/courses/${course.id}`)
      .send({ duration: "new duration" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      id: course.id,
      courseName: "name",
      duration: "new duration",
    });
  });

  it("Return: body error, You are not allowed to access this information | Status code: 200", async () => {
    const course = new Course();
    course.courseName = "name";
    course.duration = "duration";

    const user = new User();
    user.firstName = "Name";
    user.lastName = "LastName";
    user.email = "name@mail.com";
    user.password = "test";
    user.isAdm = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await userRepository.save(user);
    await courseRepository.save(course);

    const token = sign({ id: user.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.EXPIRES_IN,
    });

    const response = await supertest(app)
      .patch(`/courses/${course.id}`)
      .send({ duration: "new duration" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({
      message: "You are not allowed to access this information",
    });
  });

  it("Return: Body error, missing authorization token | Status code: 400", async () => {
    const course = new Course();
    course.courseName = "name";
    course.duration = "duration";

    await courseRepository.save(course);

    const response = await supertest(app).patch(`/courses/${course.id}`).send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: Body error, jwt malformed | Status code: 401", async () => {
    const course = new Course();
    course.courseName = "name";
    course.duration = "duration";

    await courseRepository.save(course);

    const response = await supertest(app)
      .patch(`/courses/${course.id}`)
      .send()
      .set("Authorization", "Bearer saodhlsdjf");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "jwt malformed",
    });
  });
});
