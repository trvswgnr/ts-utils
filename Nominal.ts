export const TYPE = Symbol("TYPE");
export const VALUE = Symbol("VALUE");

export type Nominal<T, Id> = {
    [VALUE]: T;
    readonly [TYPE]: Id;
};

export function Nominal<T, Id>(v: T, t: Id): Nominal<T, Id> {
    return {
        [VALUE]: v,
        [TYPE]: t,
    };
}

export module Nominal {
    export function type<N extends Nominal<any, any>>(n: N): N[typeof TYPE] {
        return n[TYPE];
    }

    export function value<N extends Nominal<any, any>>(n: N): N[typeof VALUE] {
        return n[VALUE];
    }

    export function is_nominal<T, Id>(v: unknown): v is Nominal<T, Id> {
        return typeof v === "object" && v !== null && TYPE in v && VALUE in v;
    }
}
