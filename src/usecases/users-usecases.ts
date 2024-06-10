import { UpdateProfilePayload } from "../adapters/routes/profile/profile-interfaces";
import { UserUpdate } from "../adapters/routes/users/users-interfaces";
import { getTransactionsByUserUC } from "./transactions-usecases";
import {
  checkUserRoll,
  getUserIdByEmail,
  updateUser,
  updateUserState,
} from "./users/users-repository";

async function checkUserRollUC(email: string) {
  try {
    const rol = await checkUserRoll(email);
    return rol;
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

async function updateProfile(payload: UpdateProfilePayload) {
  try {
    await updateUser(payload);
    return { status: "Success", message: "Update sucessfully" };
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

async function getBalance(payload: any) {
  let balance = 0;
  try {
    const userId = payload.email
      ? await getUserIdByEmail(payload.email)
      : undefined;
    const transactions = await getTransactionsByUserUC(userId, null);
    for (const transaction of transactions) {
      switch (transaction.category) {
        case "DEPOSIT":
          balance += transaction.amount;
          break;
        case "WITHDRAW":
          balance -= transaction.amount;
          break;
        case "BET":
          balance -= transaction.amount;
          break;
        case "WINNING":
          balance += transaction.amount;
          break;
      }
    }
    return { status: "Success", message: { balance: `$${balance}` } };
  } catch (error) {
    return { status: "Fail", message: error };
  }
}
async function getTransactions(payload: any) {
  try {
    const userId = payload.email
      ? await getUserIdByEmail(payload.email)
      : undefined;
    const transactions = await getTransactionsByUserUC(userId, payload.type);
    return {
      status: "Success",
      message: { transaction_number: transactions.length, transactions },
    };
  } catch (error) {
    return { status: "Fail", message: error };
  }
}
async function updateUserStateUC(payload: UserUpdate): Promise<any> {
  try {
    const update = await updateUserState(payload);
    return {
      status: "Success",
      message: update,
    };
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

export {
  checkUserRollUC,
  updateProfile,
  getBalance,
  getTransactions,
  updateUserStateUC,
};
