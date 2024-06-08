import * as admin from "firebase-admin";
import { CONSTANTS } from "./consts";
import { checkUserRollUC } from "../usecases/users-usecases";

async function isAdmin(idToken: string) {
  if (!idToken) {
    return {
      status: false,
      msg: "Token required",
    };
  }

  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const email = decodedToken.firebase.identities.email;

  const rol = await checkUserRollUC(email);

  if (rol !== CONSTANTS.rols.admin) {
    return { status: false, msg: "Unauthorized token" };
  }
  return { status: true, msg: "Allowed access" };
}
export { isAdmin };
