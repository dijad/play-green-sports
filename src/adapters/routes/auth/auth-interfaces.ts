interface CredentialsPayload {
  email: string;
  password: string;
}

interface AuthResponseLogin {
  email: string | null;
  refreshToken: string;
  accessToken: string;
}

export { CredentialsPayload , AuthResponseLogin};
