import { HttpError } from "./http-error";

export interface HttpResult<T> {
    value: T | null;
    error: HttpError | null;
}
