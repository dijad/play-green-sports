interface UserInterface {
  email: string;
}
interface UserUpdate {
  user_id: number;
  state: string;
}

export { UserInterface, UserUpdate };
