import db from "../../adapters/frameworks/db/mysql/mysql";
import { BetsInterface, UpdateBet } from "./bets-interfaces";

async function getBets(payload: BetsInterface) {
  try {
    const query = db("bets").select("*");
    if (payload.sport) {
      query.where("sport_id", payload.sport);
    }
    if (payload.event) {
      query.where("event_id", payload.event);
    }
    const result = await query;

    return result.length > 0 ? result : "Bets not found";
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

async function updateBet(payload: UpdateBet) {
  let eventId;
  try {
    if (payload.status.toUpperCase() === "WIN") {
      eventId = await db("bets")
        .select("event_id")
        .where("id", payload.bet_id)
        .first();

      await db("bets")
        .where("event_id", eventId.event_id)
        .update({ status: "LOST" });
    }
    await db("bets")
      .where("id", payload.bet_id)
      .whereNot("status", "SETTLED")
      .update({ status: payload.status.toUpperCase() });

    return true;
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

export { getBets, updateBet };
