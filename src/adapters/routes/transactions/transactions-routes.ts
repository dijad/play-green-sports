import { Request, ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { checkRole } from "../../../utils/auth-utils";
import { CONSTANTS } from "../../../utils/consts";
import { TransactionPayload } from "./transactions-interface";
import { doTransaction } from "../../../usecases/transactions-usecases";

const routes: ServerRoute[] = [
    {
      method: "POST",
      path: "/transactions",
      handler: async (request: Request, h: ResponseToolkit) => {
        const payload = request.payload as TransactionPayload;
  
        try {
          const idToken = request.headers.authorization?.split(" ")[1];
          const isUserFlag = await checkRole(idToken, CONSTANTS.rols.user, payload);
          if (!isUserFlag.status) {
            return h
              .response({ status: "Success", message: isUserFlag.msg })
              .code(403);
          }
  
          const transaction = await doTransaction(payload);
          return h.response(transaction).type("application/json");
        } catch (error) {
          return h.response({ error: "Something failed singingup" }).code(500);
        }
      },
    },
  ];
  
  export default routes;