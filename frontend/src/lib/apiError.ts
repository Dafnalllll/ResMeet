import axios from "axios";

const NOT_FOUND_STATUS = 404;

/** true bila error berasal dari respons 404 server. */
export function isNotFoundError(error: unknown): boolean {
  return (
    axios.isAxiosError(error) && error.response?.status === NOT_FOUND_STATUS
  );
}
