export const TYPE = Symbol("TYPE");
export const VALUE = Symbol("VALUE");

export type Nominal<T, Type> = {
    [VALUE]: T;
    readonly [TYPE]: Type;
};

export function Nominal<T, N>(v: T, t: N): Nominal<T, N> {
    return {
        [VALUE]: v,
        [TYPE]: t,
    };
}

export module Nominal {
    export function type<N extends Nominal<any, any>>(n: N): N[typeof TYPE] {
        return n[TYPE];
    }

    export function value<N extends Nominal<any, any>>(
        nominal: N,
    ): N[typeof VALUE] {
        return nominal[VALUE];
    }

    export function is_nominal<T, N extends PropertyKey>(
        value: unknown,
    ): value is Nominal<T, N> {
        return (
            typeof value === "object" &&
            value !== null &&
            TYPE in value &&
            VALUE in value
        );
    }
}
