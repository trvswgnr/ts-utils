declare const type: unique symbol;
export type Nominal<T, N extends PropertyKey> = T & {
    readonly [type]: N;
};

export function Nominal<T, N extends PropertyKey>(value: T): Nominal<T, N> {
    return value as Nominal<T, N>;
}

export enum Ordering {
    Less = -1,
    Equal = 0,
    Greater = 1,
}
