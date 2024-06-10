import db from "../../adapters/frameworks/db/mysql/mysql";
import { UpdateProfilePayload } from "../../adapters/routes/profile/profile-interfaces";
import { UserUpdate } from "../../adapters/routes/users/users-interfaces";

async function checkUserRoll(email: string) {
  try {
    const query = await db("users")
      .select("rol")
      .where("email", db.raw(`'${email}'`))
      .where("state", "ACTIVE")
      .first();
    if (query) {
      return query.rol;
    } else {
      return null;
    }
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

async function getUserIdByEmail(email: string) {
  try {
    const query = await db("users")
      .select("id")
      .where("email", db.raw(`'${email}'`))
      .first();
    if (query) {
      return query.id;
    } else {
      return null;
    }
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

async function updateUser(payload: UpdateProfilePayload) {
  try {
    const query = await db("users")
      .where("email", db.raw(`'${payload.email}'`))
      .update({ username: payload.username });
    if (query) {
      return query.id;
    } else {
      return null;
    }
  } catch (err) {
    return { status: "Fail", message: err };
  }
}
async function updateUserState(payload: UserUpdate) {
  try {
    const query = await db("users")
      .where("id", payload.user_id)
      .whereNot("rol", "ADMIN")
      .update({ state: payload.state });
    if (query) {
      return "User state updated successfully";
    } else {
      return "Invalid Action";
    }
  } catch (err) {
    return { status: "Fail", message: err };
  }
}

export { checkUserRoll, getUserIdByEmail, updateUser, updateUserState };
