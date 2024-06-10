import db from "../../adapters/frameworks/db/mysql/mysql";
async function insertTransaction(payload: any) {
  try {
    await db("transactions").insert(payload);
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

async function getTransactionsByUser(userId: number, category: string | null) {
  try {
    const query = db("transactions")
      .select("*")
      .where("user_id", userId)
      .whereNull("deleted_at");

    if (category) {
      query.where("category", category.toUpperCase());
    }
    const result = await query;

    return result.length > 0 ? result : 'Transaction not found';
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

export { insertTransaction, getTransactionsByUser };
