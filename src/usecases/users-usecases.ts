import { checkUserRoll } from "./users/users-repository";

async function checkUserRollUC(email: string) {
  try {
    const rol = await checkUserRoll(email);
    return rol;
  } catch (error) {
    return { status: "Fail", message: error };
  }
}

export { checkUserRollUC };
