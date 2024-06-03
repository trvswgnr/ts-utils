export type Ok<T> = {
    readonly tag: "Ok";
    readonly value: T;
};
export type Err<E> = {
    readonly tag: "Err";
    readonly error: E;
};
export type Result<T, E> = Ok<T> | Err<E>;
