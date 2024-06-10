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

async function updateUserBetsWon(betId: number) {
  let infoBet;
  let betsLost;
  try {
    const userBetsInfo = await db("user_bets")
      .select("user_id", "amount")
      .where("bet_id", betId);

    infoBet = await db("bets")
      .select("event_id", "odd")
      .where("id", betId)
      .first();

    await db("user_bets")
      .where("bet_id", betId)
      .update({ state: "WON"});

    betsLost = await db("bets")
      .select("id")
      .where("event_id", infoBet.event_id)
      .whereNotIn("id", [betId]);

    betsLost = betsLost.map((item: { id: number }) => item.id);

    await db("user_bets").whereIn("bet_id", betsLost).update("state", "LOST");

    return {userBetsInfo, odd: infoBet.odd};
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

export { insertUserBets, updateUserBetsWon };
