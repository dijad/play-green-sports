import { loadEnv } from "../env";
loadEnv();
import * as Hapi from "@hapi/hapi";
import * as HapiAuthJwt from "hapi-auth-jwt2";
import routesAuth from "../src/adapters/routes/auth/auth-routes";
import routesBets from "../src/adapters/routes/bets/bets-routes";
import routesTransactions from "../src/adapters/routes/transactions/transactions-routes";
import routesProfile from "./adapters/routes/profile/profile-routes";
import routesUsers from "./adapters/routes/users/users-routes";

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
  });

  await server.register(HapiAuthJwt);

  server.route({
    method: "GET",
    path: "/",
    handler: () => "Hello World!",
  });

  server.route(routesAuth);
  server.route(routesBets);
  server.route(routesTransactions);
  server.route(routesProfile);
  server.route(routesUsers);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init().catch((err) => {
  console.log(err);
  process.exit(1);
});
