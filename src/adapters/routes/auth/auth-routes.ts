import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { CredentialsPayload } from "./auth-interfaces";
import {
  loginWithEmailAndPassword,
  registerUser,
} from "../../../usecases/auth-usecase";
import { CONSTANTS } from "../../../utils/consts";
import { checkRole } from "../../../utils/auth-utils";

const routes: ServerRoute[] = [
  {
    method: "POST",
    path: "/signup",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as CredentialsPayload;
        const signUpResponse = await registerUser(payload, CONSTANTS.rols.user);
        return h.response(signUpResponse).type("application/json");
      } catch (error) {
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
        return h.response({ error: "Something failed logging" }).code(500);
      }
    },
  },
  {
    method: "POST",
    path: "/register-admin", //admin register to other admin
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const idToken = request.headers.authorization?.split(" ")[1];
        const isAdminFlag = await checkRole(idToken, CONSTANTS.rols.admin);
        if (!isAdminFlag.status) {
          return h
            .response({ status: "Success", message: isAdminFlag.msg })
            .code(403);
        }

        const payload = request.payload as CredentialsPayload;
        const signUpResponse = await registerUser(
          payload,
          CONSTANTS.rols.admin
        );
        return h.response(signUpResponse).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed registering" }).code(500);
      }
    },
  },
  {
    method: "POST",
    path: "/register-user", //admin register user
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const idToken = request.headers.authorization?.split(" ")[1];
        const isAdminFlag = await checkRole(idToken, CONSTANTS.rols.admin);
        if (!isAdminFlag.status) {
          return h
            .response({ status: "Success", message: isAdminFlag.msg })
            .code(403);
        }

        const payload = request.payload as CredentialsPayload;
        const signUpResponse = await registerUser(
          payload,
          CONSTANTS.rols.user
        );
        return h.response(signUpResponse).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed registering" }).code(500);
      }
    },
  },
  {
    method: "POST",
    path: "/signup/admin", // admin register on their own
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = request.payload as CredentialsPayload;
        const signUpResponse = await registerUser(
          payload,
          CONSTANTS.rols.admin
        );
        return h.response(signUpResponse).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed registering" }).code(500);
      }
    },
  },
];

export default routes;
