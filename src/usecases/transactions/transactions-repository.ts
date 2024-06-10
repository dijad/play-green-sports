import db from "../../adapters/frameworks/db/mysql/mysql";
import { TransactionInsert } from "../../adapters/routes/transactions/transactions-interface";

async function insertTransaction(payload: any) {
  try {
    await db("transactions").insert(payload);
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

export { insertTransaction };
