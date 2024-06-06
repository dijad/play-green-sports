import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { CredentialsPayload } from "../adapters/routes/auth/auth-interfaces";
import { auth } from "../adapters/frameworks/firebase";
import { DefaultResponse } from "../adapters/interfaces/interfaces";

async function registerUser(
  credentials: CredentialsPayload
): Promise<DefaultResponse | undefined> {
  try {
    await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    return {
      status: "Success",
      message: "User registered successfully",
    };
  } catch (error) {
    handleError(error, "Something failed signing up");
  }
}

async function loginWithEmailAndPassword(
  credentials: CredentialsPayload
): Promise<DefaultResponse | undefined> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
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
    handleError(error, "Something failed logging");
  }
}

function handleError(error: FirebaseError | unknown, message: string) {
  if (error instanceof FirebaseError) {
    console.error(`${message}: ${error.message}`);
  } else {
    console.error(`${message}: Unknown Error`, error);
  }
}

export { registerUser, loginWithEmailAndPassword };
