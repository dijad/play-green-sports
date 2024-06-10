import { DefaultResponse } from "../adapters/interfaces/interfaces";
import { TransactionPayload } from "../adapters/routes/transactions/transactions-interface";
import {
  insertTransaction,
  getTransactionsByUser,
} from "./transactions/transactions-repository";
import { getUserIdByEmail } from "./users/users-repository";

async function doTransaction(
  payload: TransactionPayload
): Promise<DefaultResponse | undefined> {
  try {
    const userId = payload.email
      ? await getUserIdByEmail(payload.email)
      : undefined;
    const dataInsert = normalizeDataToInsert(payload, userId);
    await insertTransaction(dataInsert);

    return { status: "Success", message: "Transaction/s done" };
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

function normalizeDataToInsert(payload: TransactionPayload, userId: number) {
  if (!Array.isArray(payload)) {
    return {
      amount: payload.amount,
      category: payload.category,
      user_id: userId,
    };
  } else {
    return payload
      .filter(
        (item): item is TransactionPayload =>
          "amount" in item && "category" in item
      )
      .map((transaction) => ({
        ...transaction,
        user_id: userId,
      }));
  }
}

async function getTransactionsByUserUC(userId: number, category: string | null): Promise<any> {
  try {
    const transactions = await getTransactionsByUser(userId, category);
    return transactions;
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

export { doTransaction, getTransactionsByUserUC };
