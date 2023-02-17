declare namespace Express {
  export interface Request {
    //extender el objeto request, para agregar el uid, y username del jwt
    uid: string;
    username: string;
  }
}
