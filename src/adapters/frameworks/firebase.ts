import firebase from "firebase/compat/app";
import "firebase/compat/auth";

function loadENV() {
  return {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
  };
}

firebase.initializeApp(loadENV());

const auth = firebase.auth();

export { auth };
