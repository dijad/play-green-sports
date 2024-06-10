import { DefaultResponse } from "../adapters/interfaces/interfaces";
import { PlaceBetPayload } from "../adapters/routes/bets/bets-interfaces";
import { BetsInterface, UpdateBet } from "./bets/bets-interfaces";
import { getBets, updateBet } from "./bets/bets-repository";
import { insertUserBets } from "./bets/userbets-repository";
import { doWinTransactionsUC } from "./transactions-usecases";
import { updateUserBetsWonUC } from "./userbets-usecases";
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

async function getBetsUC(payload: BetsInterface) {
  try {
    const bets = await getBets(payload);
    return bets;
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

async function updateBetUC(payload: UpdateBet) {
  try {
    const updateResponse = await updateBet(payload);
    if (payload.status.toUpperCase() === "WIN" && updateResponse) {
      const userIds = await updateUserBetsWonUC(payload.bet_id);
      const data = userIds.userBetsInfo.map(
        (item: any) =>
          (item = {
            user_id: item.user_id,
            amount: item.amount * userIds.odd,
            category: "WINNING",
          })
      );
      await doWinTransactionsUC(data);
    }
    return { status: "Success", message: "Bet updated successfully" };
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

export { placeBet, getBetsUC, updateBetUC };
