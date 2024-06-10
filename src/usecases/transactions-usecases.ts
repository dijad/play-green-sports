import { DefaultResponse } from "../adapters/interfaces/interfaces";
import {
  TransactionGet,
  TransactionPayload,
} from "../adapters/routes/transactions/transactions-interface";
import {
  insertTransaction,
  getTransactionsByUser,
  getTransactions,
} from "./transactions/transactions-repository";
import { getBalance } from "./users-usecases";
import { getUserIdByEmail } from "./users/users-repository";

async function doTransaction(
  payload: TransactionPayload
): Promise<DefaultResponse | undefined> {
  try {
    const userId = payload.email
      ? await getUserIdByEmail(payload.email)
      : undefined;

    const dataInsert = normalizeDataToInsert(payload, userId);

    if (!Array.isArray(dataInsert)) {
      const isValid = await isValidTransaction(dataInsert, {
        email: payload.email,
      });
      if (isValid) {
        await insertTransaction(dataInsert);
      } else {
        return { status: "Success", message: "Insufficent balance" };
      }
    } else {
      for (const data of dataInsert) {
        const isValid = await isValidTransaction(data, {
          email: payload.email,
        });
        if (isValid) {
          await insertTransaction(data);
        } else {
          return { status: "Success", message: "Insufficent balance" };
        }
      }
    }

    return { status: "Success", message: "Transaction/s done" };
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

async function isValidTransaction(
  payload: any,
  email: { email: string | null }
) {
  const isWithdrawOrBet = ["WITHDRAW", "BET"].includes(
    payload.category.toUpperCase()
  );
  if (!isWithdrawOrBet) {
    return true;
  }

  const message = (await getBalance(email)).message as {
    balance: string;
  };
  const balance = Number(message.balance.split("$")[1]);
  const response = payload.amount > balance ? false : true;
  return response;
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

async function getTransactionsByUserUC(
  userId: number,
  category: string | null
): Promise<any> {
  try {
    const transactions = await getTransactionsByUser(userId, category);
    return transactions;
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

async function getTransactionsUC(payload: TransactionGet): Promise<any> {
  try {
    const transactions = await getTransactions(payload);
    return transactions;
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

async function doWinTransactionsUC(payload: any): Promise<any> {
  try {
    await insertTransaction(payload);
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

export {
  doTransaction,
  getTransactionsByUserUC,
  getTransactionsUC,
  doWinTransactionsUC,
};
