import db from "../../adapters/frameworks/db/mysql/mysql";

async function insertUser(email: string, rol: string) {
  const data = { email, rol };

  try {
    await db("users").insert(data);
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

export { insertUser };
