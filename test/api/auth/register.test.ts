import supertest from "supertest";
import app from "../../../src/app";
import dotenv from "dotenv";
dotenv.config();

const api = supertest(app);

describe("Pruebas en el endpoint /api/auth/register", () => {
  test("debe de registrar un usuario correctamente", async () => {
    const user = {
      username: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };
    const registerResponse = await api.post("/api/auth/register").send(user);
    const { ok, username } = registerResponse.body;

    expect(registerResponse.statusCode).toBe(201);
    expect(ok).toBeTruthy();
    expect(registerResponse.body).toHaveProperty("uid");
    expect(username).toBe(user.username);
    expect(registerResponse.body).toHaveProperty("token");

    // eliminar el usuario creado para no llenar la db
    const deleteResponse = await api
      .delete(`/api/auth/${registerResponse.body.uid}`)
      .set("x-token", registerResponse.body.token);

    expect(deleteResponse.body.ok).toBeTruthy();
    expect(deleteResponse.body.msg).toBe(
      `Usuario ${user.username} eliminado con éxito`
    );
  }, 10000);
  test("debe de fallar al registrar un usuario ya existente", async () => {
    const user = {
      username: "Test User",
      email: "test@test.com",
      password: "passwordtest",
    };
    const registerResponse = await api.post("/api/auth/register").send(user);
    const { ok, errors } = registerResponse.body;

    expect(registerResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.email.msg).toBe("Email ya se encuentra registrado");
  });
  test("debe de fallar al registrar por falta de 'username' en la peticion", async () => {
    const user = {
      email: "johndoe@example.com",
      password: "password",
    };
    const registerResponse = await api.post("/api/auth/register").send(user);
    const { ok, errors } = registerResponse.body;

    expect(registerResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.username.msg).toBe("El nombre es obligatorio");
  });
  test("debe de fallar al registrar por falta de 'email' en la peticion", async () => {
    const user = {
      username: "John Doe",
      password: "password",
    };
    const registerResponse = await api.post("/api/auth/register").send(user);
    const { ok, errors } = registerResponse.body;

    expect(registerResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.email.msg).toBe("El email es obligatorio");
  });
  test("debe de fallar al registrar por email inválido en la peticion", async () => {
    const user = {
      username: "John Doe",
      email: "jhondoe",
      password: "password",
    };
    const registerResponse = await api.post("/api/auth/register").send(user);
    const { ok, errors } = registerResponse.body;

    expect(registerResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.email.msg).toBe("Email no válido");
  });
  test("debe de fallar al registrar por falta de 'password' en la peticion", async () => {
    const user = {
      username: "John Doe",
      email: "jhondoe@gmail.com",
    };
    const registerResponse = await api.post("/api/auth/register").send(user);
    const { ok, errors } = registerResponse.body;

    expect(registerResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.password.msg).toBe("La contraseña es obligatoria");
  });
  test("debe de fallar al registrar por password inválida en la peticion", async () => {
    const user = {
      username: "John Doe",
      email: "jhondoe",
      password: "12345",
    };
    const registerResponse = await api.post("/api/auth/register").send(user);
    const { ok, errors } = registerResponse.body;

    expect(registerResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.password.msg).toBe(
      "La contraseña debe tener al menos 6 caracteres"
    );
  });
});
