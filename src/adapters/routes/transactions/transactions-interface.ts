interface TransactionPayload {
  email: string | null;
  category: string;
  amount: number;
}

interface TransactionInsert {
  payload: TransactionPayload
  user_id: number;
}

interface TransactionGet {
  user_id: number | null;
  category: string | null
}

export { TransactionPayload, TransactionInsert, TransactionGet };
