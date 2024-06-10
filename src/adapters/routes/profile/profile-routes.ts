import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { checkRole } from "../../../utils/auth-utils";
import { CONSTANTS } from "../../../utils/consts";
import { UpdateProfilePayload } from "./profile-interfaces";
import {
  getBalance,
  getTransactions,
  updateProfile,
} from "../../../usecases/users-usecases";

const routes: ServerRoute[] = [
  {
    method: "PUT",
    path: "/profile",
    handler: async (request: Request, h: ResponseToolkit) => {
      const payload = request.payload as UpdateProfilePayload;

      try {
        const idToken = request.headers.authorization?.split(" ")[1];
        const isUserFlag = await checkRole(
          idToken,
          CONSTANTS.rols.user,
          payload
        );
        if (!isUserFlag.status) {
          return h
            .response({ status: "Success", message: isUserFlag.msg })
            .code(403);
        }

        const update = await updateProfile(payload);
        return h.response(update).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed singingup" }).code(500);
      }
    },
  },
  {
    method: "GET",
    path: "/profile/balance",
    handler: async (request: Request, h: ResponseToolkit) => {
      const payload = {};

      try {
        const idToken = request.headers.authorization?.split(" ")[1];
        const isUserFlag = await checkRole(
          idToken,
          CONSTANTS.rols.user,
          payload
        );
        if (!isUserFlag.status) {
          return h
            .response({ status: "Success", message: isUserFlag.msg })
            .code(403);
        }

        const update = await getBalance(payload);
        return h.response(update).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed singingup" }).code(500);
      }
    },
  },
  {
    method: "GET",
    path: "/profile/transactions",
    handler: async (request: Request, h: ResponseToolkit) => {
      const payload = request.query;

      try {
        const idToken = request.headers.authorization?.split(" ")[1];
        const isUserFlag = await checkRole(
          idToken,
          CONSTANTS.rols.user,
          payload
        );
        if (!isUserFlag.status) {
          return h
            .response({ status: "Success", message: isUserFlag.msg })
            .code(403);
        }

        const update = await getTransactions(payload);
        return h.response(update).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed singingup" }).code(500);
      }
    },
  },
];

export default routes;
