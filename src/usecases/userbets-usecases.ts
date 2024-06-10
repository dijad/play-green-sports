import { updateUserBetsWon } from "./bets/userbets-repository";

async function updateUserBetsWonUC(betId: number) {
  try {
    const update = await updateUserBetsWon(betId);
    return update;
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

export { updateUserBetsWonUC };
