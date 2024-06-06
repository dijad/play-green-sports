import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { CredentialsPayload } from "./auth-interfaces";
import {
  loginWithEmailAndPassword,
  registerUser,
} from "../../../usecases/auth-usecase";

const routes: ServerRoute[] = [
  {
    method: "POST",
    path: "/signup",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as CredentialsPayload;
        const signUpResponse = await registerUser(payload);
        return h.response(signUpResponse).type("application/json");
      } catch (error) {
        console.error("Something failed singingup", error);
        return h.response({ error: "Something failed singingup" }).code(500);
      }
    },
  },
  {
    method: "POST",
    path: "/login",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as CredentialsPayload;
        const loginResponse = await loginWithEmailAndPassword(payload);
        return h.response(loginResponse).type("application/json");
      } catch (error) {
        console.error("Something failed logging", error);
        return h.response({ error: "Something failed logging" }).code(500);
      }
    },
  },
];

export default routes;
