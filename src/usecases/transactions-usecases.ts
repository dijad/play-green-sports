import { DefaultResponse } from "../adapters/interfaces/interfaces";
import {
  TransactionInsert,
  TransactionPayload,
} from "../adapters/routes/transactions/transactions-interface";
import { insertTransaction } from "./transactions/transactions-repository";
import { getUserIdByEmail } from "./users/users-repository";

async function doTransaction(
  payload: TransactionPayload
): Promise<DefaultResponse | undefined> {
  let userId;

  try {
    if (payload.email) {
      userId = await getUserIdByEmail(payload.email);
    }
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

export { doTransaction };
