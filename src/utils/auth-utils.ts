import * as admin from "firebase-admin";
import { checkUserRollUC } from "../usecases/users-usecases";
import { PlaceBetPayload } from "../adapters/routes/bets/bets-interfaces";

async function checkRole(idToken: string, requiredRole: string, payload: any | null = null) {
  if (!idToken) {
    return {
      status: false,
      msg: "Token required",
    };
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.firebase.identities.email;
    if(payload){
      payload.email = email[0];
    }
    const userRole = await checkUserRollUC(email);

    if (userRole === requiredRole) {
      return { status: true, msg: "Allowed access" };
    } else {
      return { status: false, msg: "Unauthorized token" };
    }
  } catch (error) {
    return { status: false, msg: "Error verifying token" };
  }
}
export { checkRole };
