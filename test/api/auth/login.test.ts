import supertest from "supertest";
import app from "../../../src/app";
const api = supertest(app);

describe("Pruebas en el endpoint /api/auth/login", () => {
  test("debe de iniciar sesion correctamente ", async () => {
    const user = {
      email: "test@test.com",
      password: "passwordtest",
    };
    const loginResponse = await api.post("/api/auth/login").send(user);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.ok).toBeTruthy();
    expect(loginResponse.body).toHaveProperty("uid");
    expect(loginResponse.body).toHaveProperty("username");
    expect(loginResponse.body).toHaveProperty("token");
  });
  test("debe de fallar al iniciar sesion un usuario inexistente", async () => {
    const user = {
      email: "messi@ronaldo.com",
      password: "dimaria",
    };
    const loginResponse = await api.post("/api/auth/login").send(user);
    const { ok, errors } = loginResponse.body;

    expect(loginResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.email.msg).toBe("No existe un usuario con este email");
  });
  test("debe de fallar al iniciar sesion por falta de 'email' en la peticion", async () => {
    const user = {
      password: "dimaria",
    };
    const loginResponse = await api.post("/api/auth/login").send(user);
    const { ok, errors } = loginResponse.body;

    expect(loginResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.email.msg).toBe("El email es obligatorio");
  });
  test("debe de fallar al iniciar sesion por email inválido en la peticion", async () => {
    const user = {
      email: "campeondelmundo",
      password: "dimaria",
    };
    const loginResponse = await api.post("/api/auth/login").send(user);
    const { ok, errors } = loginResponse.body;

    expect(loginResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.email.msg).toBe("Email no válido");
  });
  test("debe de fallar al iniciar sesion por falta de 'password' en la peticion", async () => {
    const user = {
      email: "messi@ronaldo.com",
    };
    const loginResponse = await api.post("/api/auth/login").send(user);
    const { ok, errors } = loginResponse.body;

    expect(loginResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.password.msg).toBe("La contraseña es obligatoria");
  });
  test("debe de fallar al iniciar sesion por falta de caracteres de la contraseña en la peticion", async () => {
    const user = {
      email: "messi@ronaldo.com",
      password: "12345",
    };
    const loginResponse = await api.post("/api/auth/login").send(user);
    const { ok, errors } = loginResponse.body;

    expect(loginResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.password.msg).toBe(
      "La contraseña debe tener al menos 6 caracteres"
    );
  });
  test("debe de fallar al iniciar sesion por password incorrecta en la peticion", async () => {
    const user = {
      email: "test@test.com",
      password: "12345678",
    };
    const loginResponse = await api.post("/api/auth/login").send(user);
    const { ok, errors } = loginResponse.body;

    expect(loginResponse.statusCode).toBe(400);
    expect(ok).toBeFalsy();
    expect(errors.password.msg).toBe("La contraseña es incorrecta");
  });
});
