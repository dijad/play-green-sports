import { CONSTANTS } from "./consts";

function handleError(error: any) {
  const responseError = { status: "Error", message: error.toString() };
  return responseError;
}

export { handleError };
