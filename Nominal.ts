/**
 * This module provides a convenient way to create and work with nominal types.
 *
 * A nominal type system means that each type is unique and, even if types have
 * the same data and/or structure, you cannot assign across types.
 *
 * TypeScript's type system is structural, which means if the type is shaped
 * like a duck, it's a duck. If a goose has all the same attributes as a duck,
 * then it is also considered a duck.
 *
 * @note these Nominal types *are* enforced at runtime - if you just want type
 * safety at compile time, then use `Branded` instead.
 *
 * ```ts
 * const a = Nominal(1, "a");
 * ```
 *
 * @module
 */

import { TYPE, VALUE } from "./shared";

/**
 * A nominal type is a type that has a type-safe tag and value.
 *
 * @note these types *are* enforced at runtime, and therefore incur a runtime
 * cost. If you just want type safety at compile time, then use `Branded`
 * instead.
 */
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
