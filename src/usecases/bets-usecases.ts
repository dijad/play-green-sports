import { DefaultResponse } from "../adapters/interfaces/interfaces";
import { PlaceBetPayload } from "../adapters/routes/bets/bets-interfaces";
import { insertUserBets } from "./bets/userbets-repository";
import { getUserIdByEmail } from "./users/users-repository";

async function placeBet(
  payload: PlaceBetPayload
): Promise<DefaultResponse | undefined> {
  try {
    const userId = payload.email
      ? await getUserIdByEmail(payload.email)
      : undefined;

    await insertUserBets(payload, userId);

    return { status: "Success", message: "Bet placed successfully" };
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

export { placeBet };
