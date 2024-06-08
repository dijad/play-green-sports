import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { insertUser } from "../usecases/auth/auth-repository";

import { FirebaseError } from "firebase/app";
import { CredentialsPayload } from "../adapters/routes/auth/auth-interfaces";
import { firebaseConnection } from "../adapters/frameworks/firebase";
import { DefaultResponse } from "../adapters/interfaces/interfaces";
import { handleError } from "../utils/utils";

async function registerUser(
  credentials: CredentialsPayload,
  rol: string
): Promise<DefaultResponse | undefined> {
  try {
    await createUserWithEmailAndPassword(
      firebaseConnection.auth(),
      credentials.email,
      credentials.password
    );
    await insertUser(credentials.email, rol);

    return {
      status: "Success",
      message: "User registered successfully",
    };
  } catch (error) {
    return handleError(error);
  }
}

async function loginWithEmailAndPassword(
  credentials: CredentialsPayload
): Promise<DefaultResponse | undefined> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseConnection.auth(),
      credentials.email,
      credentials.password
    );
    const user = userCredential.user;
    const accessToken = await user.getIdToken();
    const refreshToken = (userCredential as any)._tokenResponse.refreshToken;
    return {
      status: "Success",
      message: {
        email: user.email,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    };
  } catch (error) {
    return handleError(error);
  }
}

export { registerUser, loginWithEmailAndPassword };
