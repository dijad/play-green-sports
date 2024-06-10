import db from "../../adapters/frameworks/db/mysql/mysql";
import { PlaceBetPayload } from "../../adapters/routes/bets/bets-interfaces";

async function insertUserBets(payload: PlaceBetPayload, userId: number) {
  const data = {
    user_id: userId,
    bet_id: payload.bet_id,
    amount: payload.amount,
  };

  try {
    await db("user_bets").insert(data);
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

export { insertUserBets };
