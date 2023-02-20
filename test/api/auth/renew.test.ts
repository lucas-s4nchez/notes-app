import supertest from "supertest";
import app from "../../../src/app";
const api = supertest(app);

describe("Pruebas en el endpoint /api/auth/renew", () => {
  test("debe de generar un nuevo token a un usuario autenticado", async () => {
    const user = { email: "test@test.com", password: "passwordtest" };
    const loginResponse = await api.post("/api/auth/login").send(user);
    const {
      token: oldToken,
      uid: oldUid,
      username: oldUsername,
    } = loginResponse.body;

    const renewTokenReponse = await api
      .get("/api/auth/renew")
      .set("x-token", oldToken);
    const { uid: newUid, username: newUsername, ok } = renewTokenReponse.body;

    expect(renewTokenReponse.statusCode).toBe(200);
    expect(ok).toBeTruthy();
    expect(renewTokenReponse.body).toHaveProperty("uid");
    expect(renewTokenReponse.body).toHaveProperty("username");
    expect(renewTokenReponse.body).toHaveProperty("token");

    //el uid y el username deben de ser los mismos que el del usuario autenticado
    expect(oldUid).toEqual(newUid);
    expect(oldUsername).toEqual(newUsername);
  });
  test("debe de fallar al generar un nuevo token por falta de token en la peticion", async () => {
    const renewTokenReponse = await api.get("/api/auth/renew");
    const { ok, msg } = renewTokenReponse.body;

    expect(renewTokenReponse.statusCode).toBe(401);
    expect(ok).toBeFalsy();
    expect(msg).toBe("No hay token en la petición");
  });
  test("debe de fallar al generar un nuevo token por token no válido en la peticion", async () => {
    const renewTokenReponse = await api
      .get("/api/auth/renew")
      .set("x-token", "tokennoválido");
    const { ok, msg } = renewTokenReponse.body;

    expect(renewTokenReponse.statusCode).toBe(401);
    expect(ok).toBeFalsy();
    expect(msg).toBe("Token no válido");
  });
});
