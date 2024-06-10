interface TransactionPayload {
  email: string | null;
  category: string;
  amount: number;
}

interface TransactionInsert {
  payload: TransactionPayload
  user_id: number;
}

export { TransactionPayload, TransactionInsert };
