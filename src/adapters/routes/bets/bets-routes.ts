import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { PlaceBetPayload } from "./bets-interfaces";
import { CONSTANTS } from "../../../utils/consts";
import { checkRole } from "../../../utils/auth-utils";
import { placeBet } from "../../../usecases/bets-usecases";

const routes: ServerRoute[] = [
  {
    method: "POST",
    path: "/bets",
    handler: async (request: Request, h: ResponseToolkit) => {
      const payload = request.payload as PlaceBetPayload;

      try {
        const idToken = request.headers.authorization?.split(" ")[1];
        const isUserFlag = await checkRole(idToken, CONSTANTS.rols.user, payload);
        if (!isUserFlag.status) {
          return h
            .response({ status: "Success", message: isUserFlag.msg })
            .code(403);
        }

        const placedBet = await placeBet(payload);
        return h.response(placedBet).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed singingup" }).code(500);
      }
    },
  },
];

export default routes;
