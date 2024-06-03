/**
 * This module provides a convenient way to work with the concept of "branded"
 * types, which are a way to associate a type-safe tag with a value.
 *
 * @note this type is *not* enforced at runtime, and therefore does not incur a
 * runtime cost. If you want type safety at runtime, then use `Nominal` instead.
 */

import type { TYPE } from "./shared";

/**
 * A branded type is a type that is the intersection of a value and a type-safe
 * tag.
 *
 * @note this type is *not* enforced at runtime, and therefore does not incur a
 * runtime cost. If you want type safety at runtime, then use `Nominal` instead.
 */
export type Branded<T extends {}, Type> = T & {
    readonly [TYPE]: Type;
};

/**
 * Brand a value with a type-safe tag.
 */
export function Branded<T extends {}, Type = never>(
    value: T,
    _type?: Type,
): Branded<T, Type> {
    return value as any;
}
