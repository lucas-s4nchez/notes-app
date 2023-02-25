import supertest from "supertest";
import app from "../../../src/app";
import Note from "../../../src/models/Note";
const api = supertest(app);

const loginValidUser = async (): Promise<string> => {
  const loginResponse = await api.post("/api/auth/login").send({
    email: "test@test.com",
    password: "passwordtest",
  });
  return loginResponse.body.token;
};
const loginInvalidUser = async (): Promise<string> => {
  const loginResponse = await api.post("/api/auth/login").send({
    email: "jhondoe@test.com",
    password: "passwordtest",
  });
  return loginResponse.body.token;
};

const testNote = {
  title: "note de prueba",
  content: "contenido de prueba",
  date: Date.now(),
};
const updatedTestNote = {
  title: "note de prueba editada",
  content: "contenido de prueba editado",
  date: Date.now(),
};

describe("Pruebas en el endpoint '/api/notes/' método [POST]", () => {
  afterEach(async () => {
    await Note.deleteMany({});
  });

  //CRUD
  test("debe de agregar una nota correctamente", async () => {
    const token: string = await loginValidUser();
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send(testNote)
      .set("x-token", token);
    const { title, content, date } = addNewNoteResponse.body.note;

    expect(addNewNoteResponse.body.ok).toBeTruthy();
    expect(title).toBe(testNote.title);
    expect(content).toBe(testNote.content);
    expect(Date.parse(date)).toBe(testNote.date);
  });
  test("debe de cargar/leer las notas de un usuario correctamente", async () => {
    const token: string = await loginValidUser();
    //agrego una nota
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send(testNote)
      .set("x-token", token);
    //obtener las notas del usuario
    const getNotesResponse = await api.get(`/api/notes/`).set("x-token", token);
    const { ok, notes } = getNotesResponse.body;

    expect(ok).toBeTruthy();
    expect(notes).toHaveLength(1);
    expect(notes[0].content).toBe(testNote.content);
    expect(notes[0].title).toBe(testNote.title);
  });
  test("debe de editar una nota existente correctamente", async () => {
    const token: string = await loginValidUser();
    //agrego una nota
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send(testNote)
      .set("x-token", token);
    const noteId = addNewNoteResponse.body.note._id;
    //edito la misma nota mediante el id
    const updateNoteResponse = await api
      .put(`/api/notes/${noteId}`)
      .send(updatedTestNote)
      .set("x-token", token);
    const { title, content, date } = updateNoteResponse.body.note;

    expect(updateNoteResponse.body.ok).toBeTruthy();
    expect(title).toBe(updatedTestNote.title);
    expect(content).toBe(updatedTestNote.content);
    expect(Date.parse(date)).toBe(updatedTestNote.date);
  });
  test("debe de eliminar una nota existente correctamente", async () => {
    const token: string = await loginValidUser();
    //agrego una nota
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send(testNote)
      .set("x-token", token);
    const noteId = addNewNoteResponse.body.note._id;
    //elimino la misma nota mediante el id
    const deleteNoteResponse = await api
      .delete(`/api/notes/${noteId}`)
      .set("x-token", token);
    const { ok } = deleteNoteResponse.body;

    expect(ok).toBeTruthy();
  });

  //Obtener una nota por el id
  test("debe de cargar/leer una nota de un usuario mediante el id correctamente", async () => {
    const token: string = await loginValidUser();
    //agrego una nota
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send(testNote)
      .set("x-token", token);
    //obtener una nota mediante el id
    const noteId = addNewNoteResponse.body.note._id;
    const getNoteByIdResponse = await api
      .get(`/api/notes/${noteId}`)
      .set("x-token", token);
    const { ok, note } = getNoteByIdResponse.body;

    expect(ok).toBeTruthy();
    expect(note.content).toBe(testNote.content);
    expect(note.title).toBe(testNote.title);
  });

  //Validaciones
  test("debe de fallar al leer/editar/borrar una nota que el usuario no creó", async () => {
    const testToken: string = await loginValidUser();
    const jhonDoeToken: string = await loginInvalidUser();
    //agrego una nota desde el usuario test@test.com
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send(testNote)
      .set("x-token", testToken);
    const noteId = addNewNoteResponse.body.note._id;
    //intento editar la misma nota con el usuario jhondoe@test.com
    const updateNoteResponse = await api
      .put(`/api/notes/${noteId}`)
      .send(updatedTestNote)
      .set("x-token", jhonDoeToken);
    const { ok, msg } = updateNoteResponse.body;

    expect(updateNoteResponse.statusCode).toBe(401);
    expect(ok).toBeFalsy();
    expect(msg).toBe("No puedes editar un nota que no creaste");
  });
  test("debe de fallar al leer/editar/borrar una nota que no existe", async () => {
    const token: string = await loginValidUser();

    const noteId = "63f012d6cffc909ce3db0892";

    const updateNoteResponse = await api
      .put(`/api/notes/${noteId}`)
      .send(updatedTestNote)
      .set("x-token", token);
    const { ok, msg } = updateNoteResponse.body;

    expect(updateNoteResponse.statusCode).toBe(404);
    expect(ok).toBeFalsy();
    expect(msg).toBe("No existe una nota con ese id");
  });
  test("debe de fallar al leer/agregar/editar/eliminar una nota por falta de 'token' en la peticion", async () => {
    const addNewNoteResponse = await api.post("/api/notes/").send(testNote);
    const { ok, msg } = addNewNoteResponse.body;

    expect(ok).toBeFalsy();
    expect(msg).toBe("No hay token en la petición");
  });
  test("debe de fallar al leer/agregar/editar/eliminar una nota por 'token' no válido en la peticion", async () => {
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send(testNote)
      .set("x-token", "tokeninválido");
    const { ok, msg } = addNewNoteResponse.body;

    expect(ok).toBeFalsy();
    expect(msg).toBe("Token no válido");
  });
  test("debe de fallar al agregar/editar una nota por falta de 'title' en la peticion", async () => {
    const token: string = await loginValidUser();
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send({ content: testNote.content, date: testNote.date })
      .set("x-token", token);
    const { ok, errors } = addNewNoteResponse.body;

    expect(ok).toBeFalsy();
    expect(errors.title.msg).toBe("El título es obligatorio");
  });
  test("debe de fallar al agregar/editar una nota por falta de caracteres del 'title' en la peticion", async () => {
    const token: string = await loginValidUser();
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send({ title: "Hi", content: testNote.content, date: testNote.date })
      .set("x-token", token);
    const { ok, errors } = addNewNoteResponse.body;

    expect(ok).toBeFalsy();
    expect(errors.title.msg).toBe("El título debe tener al menos 3 caracteres");
  });
  test("debe de fallar al agregar/editar una nota por falta de 'content' en la peticion", async () => {
    const token: string = await loginValidUser();
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send({ title: testNote.title, date: testNote.date })
      .set("x-token", token);
    const { ok, errors } = addNewNoteResponse.body;

    expect(ok).toBeFalsy();
    expect(errors.content.msg).toBe("La descripción es obligatoria");
  });
  test("debe de fallar al agregar/editar una nota por falta de caracteres del 'content' en la peticion", async () => {
    const token: string = await loginValidUser();
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send({ title: testNote.title, content: "Hi", date: testNote.date })
      .set("x-token", token);
    const { ok, errors } = addNewNoteResponse.body;

    expect(ok).toBeFalsy();
    expect(errors.content.msg).toBe(
      "La descripción debe tener al menos 5 caracteres"
    );
  });
  test("debe de fallar al agregar/editar una nota por falta de 'date' en la peticion", async () => {
    const token: string = await loginValidUser();
    const addNewNoteResponse = await api
      .post("/api/notes/")
      .send({ title: testNote.title, content: testNote.content })
      .set("x-token", token);
    const { ok, errors } = addNewNoteResponse.body;

    expect(ok).toBeFalsy();
    expect(errors.date.msg).toBe("La fecha es obligatoria");
  });
});
