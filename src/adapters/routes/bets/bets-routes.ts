import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { PlaceBetPayload } from "./bets-interfaces";
import { CONSTANTS } from "../../../utils/consts";
import { checkRole } from "../../../utils/auth-utils";
import { getBetsUC, placeBet, updateBetUC } from "../../../usecases/bets-usecases";
import { BetsInterface, UpdateBet } from "../../../usecases/bets/bets-interfaces";

const routes: ServerRoute[] = [
  {
    method: "POST",
    path: "/bets",
    handler: async (request: Request, h: ResponseToolkit) => {
      const payload = request.payload as PlaceBetPayload;

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

        const placedBet = await placeBet(payload);
        return h.response(placedBet).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed singingup" }).code(500);
      }
    },
  },
  {
    method: "GET",
    path: "/bets",
    handler: async (request: Request, h: ResponseToolkit) => {
      const payload = request.query;

      try {
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
        const data: BetsInterface = {
          sport: payload.sport,
          event: payload.event,
        };
        const bets = await getBetsUC(data);
        return h.response(bets).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed singingup" }).code(500);
      }
    },
  },
  {
    method: "PUT",
    path: "/bets/{bet_id}/",
    handler: async (request: Request, h: ResponseToolkit) => {
      const payload = {};
      const status = request.query.status;
      const betId = request.params.bet_id;

      try {
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
        const data: UpdateBet = {
          bet_id: betId,
          status: status,
        };
        const bets = await updateBetUC(data);
  
        return h.response(bets).type("application/json");
      } catch (error) {
        return h.response({ error: "Something failed singingup" }).code(500);
      }
    },
  },
];

export default routes;
