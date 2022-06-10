import supertest from "supertest";
import { Connection } from "../..";
import app from "../../../app";
import { userRepository } from "../../../repositories";
import { sign } from "jsonwebtoken";
import { User } from "../../../entities";

describe("Patch user route | Integration Test", () => {
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

  it("Return: Patched user as JSON response | Status code: 200", async () => {
    const user = new User();
    user.firstName = "Name";
    user.lastName = "LastName";
    user.email = "name@mail.com";
    user.password = "test";
    user.isAdm = true;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await userRepository.save(user);

    const token = sign({ id: user.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.EXPIRES_IN,
    });

    const response = await supertest(app)
      .patch(`/users/${user.id}`)
      .send({ firstName: "New Name", email: "new.name@mail.com" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.firstName).toStrictEqual("New Name");
    expect(response.body.email).toStrictEqual("new.name@mail.com");
  });

  it("Return: body error, You can't access information of another user | Status code: 403", async () => {
    const user = new User();
    user.firstName = "Name";
    user.lastName = "LastName";
    user.email = "name@mail.com";
    user.password = "test";
    user.isAdm = false;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    const anotherUser = new User();
    anotherUser.firstName = "Other";
    anotherUser.lastName = "OtherName";
    anotherUser.email = "other@mail.com";
    anotherUser.password = "test";
    anotherUser.isAdm = false;
    anotherUser.createdAt = new Date();
    anotherUser.updatedAt = new Date();

    await userRepository.save(user);
    await userRepository.save(anotherUser);

    const token = sign({ id: user.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.EXPIRES_IN,
    });

    const response = await supertest(app)
      .patch(`/users/${anotherUser.id}`)
      .send({ firstName: "New Name", email: "new.name@mail.com" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({
      message: "You can't access information of another user",
    });
  });

  it("Return: Body error, missing authorization token | Status code: 400", async () => {
    const user = new User();
    user.firstName = "Name";
    user.lastName = "LastName";
    user.email = "name@mail.com";
    user.password = "test";
    user.isAdm = true;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await userRepository.save(user);

    const response = await supertest(app)
      .patch(`/users/${user.id}`)
      .send({ firstName: "New Name", email: "new.name@mail.com" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: Body error, jwt malformed | Status code: 401", async () => {
    const user = new User();
    user.firstName = "Name";
    user.lastName = "LastName";
    user.email = "name@mail.com";
    user.password = "test";
    user.isAdm = true;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    await userRepository.save(user);

    const response = await supertest(app)
      .patch(`/users/${user.id}`)
      .send({ firstName: "New Name", email: "new.name@mail.com" })
      .set("Authorization", "Bearer asdofhjsd");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "jwt malformed",
    });
  });
});
