import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { checkRole } from "../../../utils/auth-utils";
import { CONSTANTS } from "../../../utils/consts";
import {
  getBalance,
  updateUserStateUC,
} from "../../../usecases/users-usecases";
import { UserInterface, UserUpdate } from "./users-interfaces";

const routes: ServerRoute[] = [
  {
    method: "GET",
    path: "/users/balance",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = {};
        const idToken = request.headers.authorization?.split(" ")[1];
        const isUserFlag = await checkRole(
          idToken,
          CONSTANTS.rols.admin,
          payload
        );
        if (!isUserFlag.status) {
          return h
            .response({ status: "Success", message: isUserFlag.msg })
            .code(403);
        }
        const data: UserInterface = { email: request.query.email };
        const update = await getBalance(data);
        return h.response(update).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed singingup" }).code(500);
      }
    },
  },
  {
    method: "PUT",
    path: "/users/{user_id}",
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const payload = {};
        const idToken = request.headers.authorization?.split(" ")[1];
        const isUserFlag = await checkRole(
          idToken,
          CONSTANTS.rols.admin,
          payload
        );
        if (!isUserFlag.status) {
          return h
            .response({ status: "Success", message: isUserFlag.msg })
            .code(403);
        }

        const data: UserUpdate = {
          state: request.query.state.toUpperCase(),
          user_id: request.params.user_id,
        };
        const update = await updateUserStateUC(data);
        return h.response(update).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed singingup" }).code(500);
      }
    },
  },
];

export default routes;
