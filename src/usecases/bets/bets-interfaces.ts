interface BetsInterface {
  sport: number | null;
  event: number | null;
}

interface UpdateBet {
  status: string;
  bet_id: number;
}

export { BetsInterface, UpdateBet };
