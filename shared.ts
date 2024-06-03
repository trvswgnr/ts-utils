export const NEVER = undefined as never;

export enum Ordering {
    Less = -1,
    Equal = 0,
    Greater = 1,
}

export type Args = readonly any[];
export type Fn<T = any, A extends Args = Args> = (...args: A) => T;
export type Ctor<T = any, A extends Args = Args> = new (...args: A) => T;

/** where functions go to die */
export const no_exec = <F extends Fn>(_f: F): void => {};

/**
 * used to access the type of a Nominal type
 * @internal
 */
export const TYPE = Symbol("TYPE");

/**
 * used to access the value of a Nominal type
 * @internal
 */
export const VALUE = Symbol("VALUE");
